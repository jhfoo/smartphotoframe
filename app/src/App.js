// non-React external dependencies
import React, { Component } from 'react';
import { Router, Route, IndexRoute, Link, hashHistory } from 'react-router';

// non-React external dependencies
import Promise from 'bluebird';
import moment from 'moment';

// my components
import Header from './Header';
import LoginContainer from './LoginContainer';
import AlbumsContainer from './AlbumsContainer';
import PhotosContainer from './PhotosContainer';

import logo from './logo.svg';
import './App.css';

/* global FB, $ */

class App extends Component {
  constructor(props) {
    super(props);
    this.statusChangeCallback = this.statusChangeCallback.bind(this);  
    this.onLogin = this.onLogin.bind(this);
    this.onLogout = this.onLogout.bind(this);
    this.doPromisedFbApiCall = this.doPromisedFbApiCall.bind(this);
    this.onSelectAlbum = this.onSelectAlbum.bind(this);
    this.onSelectAlbums = this.onSelectAlbums.bind(this);

    this.state = {
      UserId: '',
      UserName:'Guest',
      photos: [],
      albums: [],
      isShowPhotos: false,
      isFirstRenderCompleted: false
    };
  }

  doPromisedFbApiCall(url, ApiParams) {
    console.log('Fb API call: ' + url);
    return new Promise((resolve, reject) => {
      FB.api(url, ApiParams, function(resp) {
        if (!resp && resp.error)
          reject(resp.error);
        else {
          console.log(url + ' response:');
          console.log(resp);
          resolve(resp);
        }
      });
    });
  }

  onSelectAlbum(AlbumId) {
    var self = this;
    console.log('onSelectAlbum()');
    var url = '/' + AlbumId + '/photos';
    this.doPromisedFbApiCall(url, {
      fields: 'created_time, name, link, from, images'
    })
    .then((resp) => {
      self.setState({
        photos: resp.data,
        albums: [],
        isShowPhotos: true
      });
    });
  }
 // This is called with the results from from FB.getLoginStatus().
  statusChangeCallback(resp) {
    console.log('statusChangeCallback');
    console.log(resp);
    // The response object is returned with a status field that lets the
    // app know the current login status of the person.
    // Full docs on the response object can be found in the documentation
    // for FB.getLoginStatus().
    if (resp.status === 'connected') {
      // Logged into your app and Facebook.
      //this.onLoginOk();
    } else if (resp.status === 'not_authorized') {
      // The person is logged into Facebook, but not your app.
      document.getElementById('status').innerHTML = 'Please log ' +
        'into this app.';
    } else {
      // not logged into Facebook
      this.setState({
        UserToken: '',
        UserName: 'Guest'
      });
    }
  }
  onLogout() {
    var self = this;
    FB.logout((resp) => {
      console.log('onLogout() resp');
      console.log(resp);
      if (resp && !resp.error) 
        self.setState({
          UserId: '',
          UserName: 'Guest',
          photos: [],
          albums: []
        });
    });
  }

  getPromisedFbLogin() {
    return new Promise((resolve, reject) => {
      FB.login((resp) => {
        resolve(resp);        
      }, {
        scope: 'user_photos, public_profile'
      });
    });
  }

  onSelectAlbums() {
    var self = this;

    // stop photo run
    this.setState({
      isShowPhotos: false
    });
    $('.carousel div').stop (true, false);

    this.doPromisedFbApiCall('/me/albums', {
      fields: 'updated_time, created_time, name, count'
    })
    .then((resp) => {
      self.setState({
        albums: resp.data
      });
      return null;
    })
    .catch((err) => {
      console.log('ERROR:');
      console.log(err);
    });
  }
  onLogin() {
    var self = this;
    this.getPromisedFbLogin()
    .then((resp) => {
      console.log('getPromisedFbLogin() resp:');
      console.log(resp);
      if (resp.status === 'connected') {
        return this.doPromisedFbApiCall('/me', {fields:'last_name, first_name'});
      } else {
        throw new Error(resp);
      }
    })
    .then((resp) => {
      self.setState({
        UserId: resp.id,
        UserName: resp.first_name
      });
      self.onSelectAlbums();
      return null;
    })
    .catch((err) => {
      console.log('ERROR:');
      console.log(err);
    });
  }
  render() {
    return (
      <div>
        <Header UserId={this.state.UserId} UserName={this.state.UserName} onSelectAlbums={this.onSelectAlbums} onLogout={this.onLogout}/>      
        <PhotosContainer photos={this.state.photos} isShowPhotos={this.state.isShowPhotos} />
        <LoginContainer UserId={this.state.UserId} onLogin={this.onLogin}/>
        <AlbumsContainer albums={this.state.albums} onSelectAlbum={this.onSelectAlbum}/>
      </div>
    );
  }
}

export default App;
