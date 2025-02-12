---
title: Flexbox Film Credits
description: Flexbox film credits layout, inspired by the old fashioned Hollywood movies!
date: 2016-01-05
source: https://codepen.io/plfstr/pen/JGWYar
tags: [codepen, flexbox, effect, css, pickedpen]
---
I saw a lot of classic films over the Christmas break. As the credits were rolling for yet another classic, I looked at the dotted divider between film character and actor and something in my brain said ‘flexbox’, and this is what happened. 

{% include codepen.html codepen="JGWYar" height="450" %}

An ideal layout for displaying cast and crew list beneath a video embed.

The layout does OK when viewed on smaller screen sizes, the actors wrap beneath their name. It’s a semantic list, so without styles it falls back to, _character - actor_. I’m a little disappointed by the level of markup required, I wish it were cleaner. A pseudo element would be ideal instead of the extra hyphen span. I also wish the `box-decoration-break` markup could be applied to wrap the dots across multiple lines when the lines break.

After my theory and the concept was proven to work, I thoroughly enjoyed adding the Hollywood look. It was a fine excuse to use some serif fonts.
