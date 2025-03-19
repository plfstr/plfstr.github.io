---
title: Brush Swap App
description:  When did you last change your toothbrush? Use Brush Swap to remember for you. Read how this helpful web app was created.
date: 2022-12-02
tags: [pwa, app, project, js, design]
---

I have an electric toothbrush and like most toothbrushes its recommended to replace the brush after ninety days maximum (check with manufacturers recommendations). 

Three months is too long for me to remember when I last changed the brush and my brush replacements were expensive, I was wary of throwing them away too early. This is where the need for Brush Swap comes from. 

## When did you last change your toothbrush?

![Brush Swap App](/assets/images/brushswap.jpg)

Brush Swap app gives a start date (when the brush changed), the number of days remaining until you need to change and the end date when your brush should be replaced. 

When you replace your brush, press the ‘Brush Swapped’ button to reset the dates and the countdown begins again. 

Check back with the app when you get that sense that it has been a while since you last replaced it.

## The Design

I emulated the advertising for toothbrushes using bright white and blues to emulate that fresh, bright feeling of clean teeth. 

I wanted something simple and panel like, with the date and days prominently counting down. It so happened this fitted well with a striped toothpaste design. 

## Building the app

Its a simple app but with some complexity behind the scenes.

- The tapering corners of the pastes stripes are created via a CSS mask with an offset radial gradient.
- Its a progressive web app (PWA), it works offline. Users should be prompted to install the app to their devices home screen (where supported).
- The app should display the date in a local format based on users browser language preference settings using the Intl.DateTimeFormat.
- ~~Moment.js~~ Day.js performs the end date and days countdown calculations.
- A \<dialog> element final check when people change their brush, to avoid accidental deletion. 
- I have added a prompt to install to home screen to ensure the saved date is retained long term. Apple’s anti-tracking measure made local app storage trickier, its [deleted within 7 days](https://webkit.org/tracking-prevention/#7-day-cap-on-all-script-writeable-storage) of inactivity but not for installed apps.
- The [scheduled notification API](https://developer.chrome.com/docs/web-platform/notification-triggers/) would have given native app like notifications when the end date was reached. However, Chrome announced it will be dropping it. This limits the usefulness of the app as it now cant actively tell users the toothbrush has expired, they have to remember to check it.
- I added icon badging which will alert people with a notification dot on the icon when checking the app and the brush date has elapsed.
- The app also has night theme.

## A simple question and a simple app.

Overall it is a simple and effective single task app to manage a simple and effective task. 

Don’t forget to change your toothbrush! Try [Brush Swap](/brushswap/) app.
