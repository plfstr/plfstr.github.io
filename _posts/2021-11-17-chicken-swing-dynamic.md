---
title: Chicken Swing Dynamic
description: Chicken Swing revamp of the original, using the Web Animation API to dynamically change the power of the swing.
date: 2021-11-17
source: https://codepen.io/plfstr/pen/XWaaZRW
tags: [codepen, animation, svg, js, pickedpen]
---

A fork of the [original Chicken Swing](/blog/chicken-swing-svg/), this pen uses the [Web Animations API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API) to allow dynamic updating of the animations keyframes via user input.

{% include codepen.html codepen="XWaaZRW" height="500" %}

Swings don’t instantly change their movement, so the animation has to account for that to make the physics look more natural.

Each iteration of the swings animation, checks to see if the input slider has moved and the difference between this position and the last. If the input slider has changed, the JS code counts up/down and increases/decreases the rotation of the swing until it reaches the new value. 

[Chicken Swing (Dynamic)](https://codepen.io/plfstr/full/XWaaZRW/) was chosen for _CodePen Picked_ pens.

_Due to CodePens embed, the animation may stop. If this happens click ‘Rerun’ (lower right corner) and then use the slider, or visit the pen on CodePen._
