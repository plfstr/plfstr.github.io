//@ts-check
import { html, Component, render } from './bundle.min.js';

/** * @type {HTMLElement} */
const mentiondom = document.querySelector('#mentionable');
if (!mentiondom) throw new Error('No output DOM found');

/** * @type {string} */
const lang = window.navigator.language ?? 'en';

/**
 * @function numberIntl - Returns a locally formated count number
 * @param {number} count 
 * @returns {string | number}
 */
function numberIntl(count) {
    return 'Intl' in window ? new Intl.NumberFormat(lang).format(count) : Number(count)
}

/**
 * @function Mentioncount - Display mention count
 * @param {object} props
 * @param {number} props.count
 * @returns {string}
 */
function Mentioncount(props) {
    return html`<span aria-labelledby="webmentions" role="status">(${numberIntl(props.count)})</span>`;
}

/**
 * @function mentiondate - Check published date of mention OR fallback to webmention.io received date
 * @param {Date} published 
 * @param {Date} wmreceived 
 * @returns {string}
 */
function mentiondate(published, wmreceived) {
    return new Date(published ? published : wmreceived).toLocaleDateString();
}

/**
 * @function mentionurl - Return URL host...
 * @param {URL} url
 * @returns {string}
 */
function mentionurl(url) {
    return new URL(url).host;
}

/**
 * @function Mentionby - Return mention name OR URL host name
 * @param {object} props 
 * @param {string} props.name
 * @param {URL} props.url
 * @returns {string}
 */
function Mentionby(props) {
    if (props.name) {
        return html`<a href="${props.url}" rel="nofollow ugc">${props.name}</a> (${mentionurl(props.url)})`;
    } else {
        return html`<a href="${props.url}" rel="nofollow ugc">${mentionurl(props.url)}</a>`;
    }
}

/**
 * @function mentiontype - Returns an appropriate message for the mentions type
 * @param {string} type - Mention type
 * @returns {string}
 */
 function mentiontype(type = "mention-of") {
    const types = {
        "mention-of": "Mentioned",
        "like-of": "Liked",
        "bookmark-of": "Bookmarked",
        "in-reply-to": "Replied to",
        "repost-of": "Reposted"
    }
    return `${types[type]} this post`;
 }

/**
 * @function Mentionslist - Generate mentions
 * @param {object} props
 * @param {object} props.mentions
 * @returns {string | null}
 */
function Mentionslist(props) {
    let mentions = props.mentions;
    if (!props.mentions.length) return null;
    return html`
  <ul id="mentionsoutput" aria-labelledby="webmentions" tabindex="0">
    ${mentions.map((
        {
            url,
            published,
            author: {
                name: authorname,
                url: authorurl
            },
            content,
	    summary = "",
            'wm-property': wmproperty,
            'wm-received': wmreceived
        } = mention) => {
            return html`
    <li>
    	<article tabindex="0">
	      <p class="${wmproperty}" lang="auto" dir="auto">
        	<${Mentionby} name=${authorname} url=${url} />, <time datetime="${published || wmreceived}">${mentiondate(published, wmreceived)}</time> - ${ content?.text ?? mentiontype(wmproperty) }
	      </p>
	</article>
    </li>
    `})}
  </ul>
  `;
}

/**
 * @function Mentionsmessage - Returns user message
 * @param {object} props
 * @param {string} props.msg
 * @returns {string | null}
 */
function Mentionmessage(props) {
    return props.msg ? html`<p role="status">${props.msg}</p>` : null;
}

// <Mentionable/>
class Mentionable extends Component {

    constructor(props) {
        super(props);
        this.fetchNow = (ev) => {
            ev.preventDefault();
            this._fetchMentions();
            document.querySelector('#mentionsoutput').focus();
            this.setState({ lazyload: false });
        }
        this.state = {
            error: null,
            lazyload: true,
            mentioncount: 0,
            msg: "",
            mentions: []
        }
    }

    static getDerivedStateFromError(error) {
        return { error: error.message }
    }

    componentDidCatch(error) {
        console.error(error);
        this.setState({ error: error.message });
        this.setState({ msg: "Sorry, there has been an error" });
    }

    componentDidMount() {
        if (this.state.lazyload) {
            this.setState({ msg: "Loading..." });
            this._fetchCount();
        } else {
            this.setState({ msg: "Loading..." })
            this._fetchMentions();
        }
    }

    componentWillUnmount() {
    }

    /**
     * @private - Text summary list of mentions, N type(s)
     * @function mentionlist
     * @param {object} types 
     * @returns {string}
     */
    mentionlist(types) {
        let list = Object.entries(types).map(type => `${type[1]} ${type[1] !== 1 ? type[0]+'s' : type[0]}`);
        try{
          return new Intl.ListFormat(lang, { style: 'long', type: 'conjunction' }).format(list);
        } catch(err) {
          return list.join(', ');
        }
    }

    async _fetchCount() {
        // @ts-ignore
        return await fetch(`https://webmention.io/api/count?target=${encodeURIComponent(window.location.href)}`, { priority: 'low' }).then(
            response => response.json()
        ).then(
            data => {
                if (data.count) {
                    this.setState({ mentioncount: data.count });
                    this.setState({ msg: this.mentionlist(data.type) });
                } else {
                    this.setState({ msg: "No webmentions found" });
                }
            }
        ).catch(error => {
            console.warn("Request failed", error);
            this.setState({ msg: "Sorry, an error fetching webmentions" });
        });
    }

    async _fetchMentions() {
        return await fetch(`https://webmention.io/api/mentions.jf2?target=${encodeURIComponent(window.location.href)}`).then(
            response => response.json()
        ).then(
            data => {
                if (data.children.length !== 0) {
                    this.setState({ mentioncount: data.children.length });
                    this.setState({ mentions: data.children });
                    this.setState({ msg: "" });
                } else {
                    this.setState({ mentioncount: 0 });
                    this.setState({ msg: "Sorry, no webmentions" });
                }
            }
        ).catch(error => {
            console.warn("Request failed", error);
            this.setState({ msg: "Sorry, an error fetching webmentions" });
        });
    }

    render() {
        return html`
      <section>
        <h2 id="webmentions">Webmentions <${Mentioncount} count=${this.state.mentioncount} /></h2>
        <${Mentionmessage} msg=${this.state.msg} />
	${!this.state.mentions.length ?
                html`<input class="button" type="button" value="Load Webmentions" aria-controls="mentions" onClick=${this.fetchNow} />` : null
            }
	<div id="mentions">
          <${Mentionslist} mentions=${this.state.mentions} />          
        </div>        
      </section>
    `
    }

}

render(html`<${Mentionable} />`, mentiondom);
