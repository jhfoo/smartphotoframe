import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
// import './index.css';

/* global FB, Config */

  // init fb
var self = this;
window.fbAsyncInit = function () {
  FB.init({
    appId: Config.facebook.AppId,
    xfbml: true,
    version: 'v2.8'
  });

  FB.getLoginStatus((resp) => {
    self.statusChangeCallback(resp);
  });

  ReactDOM.render(
    <App />,
    document.getElementById('root')
  );
};

// load facebook sdk
(function (d, s, id) {
  var js, fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) {
    return;
  }
  js = d.createElement(s);
  js.id = id;
  js.src = "//connect.facebook.net/en_US/sdk.js";
  fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

