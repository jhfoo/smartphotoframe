# smartphotoframe
This is a browser-based photo display app that connects to Facebook and displays photos uploaded by the Facebook user account.

Created using npm install create-react-app

# FAQs
## Is it safe to link my Facebook account to this app?
While the codes are stored on a public server on the Internet, the server does little more than host them for the browser to download. Simply put, neither your account information nor your selection preferences are stored in the server.

## I don't believe you. Show me your codes!
Everything I wrote is in this repo you're seeing now. Feel free to download and try it out yourself.
1. 
## What tech did you employ in this?
2 main tech: React and Facebook SDK for JavaScript. UI framework is stock Semantic UI

## What browsers are supported?
React code was written in es2016, without much regard for legacy support. There are some browser-specific codes (eg. full screen toggle) which have equivalents for FireFox and IE. Support for them is just not prioritised at this iteration.

## Does this mean I can host and run this myself?
Absolutely. Here's a short checklist of things you'd need to do:

1. Set up a simple web server. Apache/ Nginx/ IIS are fine.
2. Point the server to /app/build as the root. Virtual server hosting will work fine without additional config, though you'd need to update the appropriate DNS server records to create a valid FQDN for the site. It's optional but setting the default index file as index.html improves the site experience.
3. Create a Facebook app. Note the app id.
4. Update Config.facebook.AppId in /js/Config.js with the app id created in #3.
