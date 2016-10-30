import React from 'react';

// stateless functional Component
export default class Header extends React.Component {
  onToggleFullScreen() {
    if (document.webkitFullscreenElement)
      document.webkitExitFullscreen();
    else
      document.body.webkitRequestFullScreen();
  }
  render() {
    var LogoutBtn = this.props.UserId === '' 
      ? ''
      : <a onClick={() => {this.props.onLogout()}} className="item"><i className="sign out icon"></i>Log Out</a>;

    var LoginMenu = null;
    if (this.props.UserId != '') {
      LoginMenu = (
        <a onClick={() => {this.props.onSelectAlbums()}} className="item">Albums</a>
      );
    }

    return (
      <div className="ui top fixed inverted menu">
        <div className="item">SmartPhotoFrame</div>
        {LoginMenu}
        <a onClick={() => {this.onToggleFullScreen()}} className="item">Full Screen</a>
        <div className="right menu">
          <a className="item"><i className="user icon"></i>{this.props.UserName}</a>
          {LogoutBtn}
        </div>
      </div>
    );
  }
}