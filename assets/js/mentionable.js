import { html, Component, render } from './bundle.min.js';

function numberIntl(count) {
  return 'Intl' in window ? new Intl.NumberFormat().format(count) : Number(count)
}

// <Mentioncount/>
function Mentioncount(props) {
  return html`<span aria-label="webmentions" role="status">(${ numberIntl(props.count) })</span>`;
}

// Check published, fallback to webmention.io received date...
function mentiondate(published, wmreceived) {
    return new Date(published ? published : wmreceived).toLocaleString();
}

// Return url host...
function mentionurl(url) {
  return new URL(url).host;
}

// <Mentionby/>
function Mentionby(props) {
  if (props.name) {
    return html`<a href="${props.url}" rel="nofollow ugc">${props.name}</a> (${ mentionurl(props.url) })`;
  } else {
    return html`<a href="${props.url}" rel="nofollow ugc">${ mentionurl(props.url) }</a>`;
  }
}

// <Mentionslist/>
function Mentionslist(props) {
  let mentions = props.mentions;
  if (!props.mentions.length) return null;
  return html`
  <ul>
    ${mentions.map((
      {
        url, 
        published,
        author: {
        name: authorname, 
        url: authorurl
        },
        content: {
            text
        },
        'wm-property': wmproperty,
        'wm-received': wmreceived
      } = mention) => {return html`
    <li>
      <p class="${wmproperty}">
        <${Mentionby} name=${authorname} url=${url} />, <time datetime="${published || wmreceived}">${mentiondate(published, wmreceived)}</time> - ${text}
      </p>
    </li>
    `})}
  </ul>
  `;
}

// <Mentionsmessage/>
function Mentionmessage(props) {
  return props.msg ? html`<p role="alert">${props.msg}</p>` : null;
}

// <Mentionable/>
class Mentionable extends Component {
    
  constructor(props) {
    super(props);
    this.fetchNow = (ev) => {
      ev.preventDefault();
      this._fetchMentions();
      this.setState({lazyload: false});
    }    
    this.state = {
      error: null,
      lazyload: true,
      mentioncount: 0,
      msg: "",
      mentions: []      
    }
    if (this.state.lazyload === false) {
      this.state.lazyload = this.isDatasaving();
    }
  }
  
  static getDerivedStateFromError(error) {
    return { error: error.message }
  }

  componentDidCatch(error) {
    console.error(error);
    this.setState({ error: error.message });
    this.setState({ msg: "Sorry, there has been an error"});
  }
  
  componentDidMount() {
    if (this.state.lazyload) {
      this._fetchCount().then(() => {
        if (this.state.mentioncount) {
          this.setState({msg: `Load ${this.state.mentioncount} ${this.state.mentioncount !== 1 ? 'webmentions' : 'webmention'}?`});
          document.querySelector('#mentions').setAttribute('aria-live', 'polite');
          document.querySelector('#mentions').setAttribute('aria-atomic', 'true');
        } else {
          this.setState({msg: "Sorry, 0 webmentions found"});
        }
      });
    } else {
        this.setState({msg: "Loading..."})
        this._fetchMentions();
    }
  }

  componentWillUnmount() {
  }
  
  isDatasaving() {
    try {
      return "connection" in navigator && navigator.connection.saveData === true;
    } catch(err) {
      return false;
    }
  }

  async _fetchCount() {
    return await fetch(`https://webmention.io/api/count?target=${ encodeURIComponent(window.location.href) }`, {priority: 'low'}).then(
      response => response.json()
    ).then(
      data => {
          this.setState({mentioncount: data.count});
          console.log(this.state.mentioncount);
        }
    ).catch(error => {
      console.warn("Request failed", error);
      this.setState({msg: "Sorry, an error fetching webmentions"});
    });
  }

  async _fetchMentions() {
    return await fetch(`https://webmention.io/api/mentions.jf2?target=${ encodeURIComponent(window.location.href) }`).then(
      response => response.json()
    ).then(
      data => {
        if (data.children.length !== 0) {
          this.setState({mentioncount: data.children.length});
          this.setState({mentions: data.children});
          this.setState({msg: ""});
        } else {
          this.setState({mentioncount: 0});
          this.setState({msg: "Sorry, no webmentions"});
        }
      }
    ).catch(error => {
      console.warn("Request failed", error);
      this.setState({msg: "Sorry, an error fetching webmentions"});
    });
  }
  
  render() {
    return html`
      <section>
        <h2 id="webmentions">Webmentions <${Mentioncount} count=${this.state.mentioncount} /></h2>
        <div id="mentions">
          <${Mentionslist} mentions=${this.state.mentions} />
          <${Mentionmessage} msg=${this.state.msg} />
        </div>
        ${this.state.lazyload ? 
          html`<input class="button" type="button" value="Load Webmentions" aria-controls="mentions" onClick=${this.fetchNow} />` : null
        }
      </section>
    `
  }

}

render(html`<${Mentionable} />`, document.querySelector('#mentionable'));
