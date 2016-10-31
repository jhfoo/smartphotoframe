import React from 'react';
import Promise from 'bluebird';

/* global $, Config */

// stateless functional Component
export default class LoginContainer extends React.Component {
  constructor(props) {
    super(props);
    this.flipBgPhoto = this.flipBgPhoto.bind(this);
    this.renderMainSegment = this.renderMainSegment.bind(this);

    this.state = {
      CurrentPhotoIndex: -1,
      timer: null
    };
  }

  wait4ImageLoad(image, resolve, reject) {
    if (image.prop('complete') === true) {
      resolve();
    }
    else
      setTimeout(() => {
        this.wait4ImageLoad(image, resolve, reject);
      }, 500);
  }

  setPromisedOpacity(el, opacity) {
    return new Promise((resolve, reject) => {
      el.animate({
        opacity: opacity
      }, 1000, () => {
        resolve();
      });
    });
  }

  flipBgPhoto() {
    var self = this;
    var BgImage = $('#BgImage');

    // turn off the lights
    this.setPromisedOpacity(BgImage, 0)
    .then(() => {
      // calc next index
      if (self.state.CurrentPhotoIndex === -1
        || self.state.CurrentPhotoIndex === Config.login.PhotoUrls.length - 1) {
        self.state.CurrentPhotoIndex = 0;
      } else {
        self.state.CurrentPhotoIndex++;
      }

      // set new image src
      BgImage.attr('src','/images/' + Config.login.PhotoUrls[this.state.CurrentPhotoIndex]);

      // wait for image to be loaded
      return new Promise((resolve, reject) => {
        this.wait4ImageLoad(BgImage, resolve, reject);
      })
    })
    .then(() => {
      var parent = BgImage.parent();
      var ParentAspectRatio = parent.width() / parent.height();

      console.log(BgImage.prop('naturalWidth'));
      if ((BgImage.prop('naturalWidth') / BgImage.prop('naturalHeight')) < ParentAspectRatio) {
        // fit to width
        console.log('Fit to width');
        BgImage.width(parent.width());
      } else {
        // fit to height
        console.log('Fit to height');
        BgImage.height(parent.height());
      }

      // turn the lights on
      return self.setPromisedOpacity(BgImage, 1);
    })
    .then(() => {
      // wait for a while
      setTimeout(() => {
        self.flipBgPhoto();
      }, Config.login.PhotoWaitDuration);
    });
  }

  componentDidMount() {
    this.flipBgPhoto();
  }

  componentDidUpdate() {
    this.flipBgPhoto();
  }

  renderMainSegment() {
    var TextStyle = {
      textAlign: 'left',
      overflow: 'auto',
      borderRight: 'solid 1px #eee',
      paddingRight: '1rem'
    };

    return (
      <div className="ui blue segment">
        <div className="ui grid">
          <div className="ten wide column" style={TextStyle}>
            <strong>What is Smart Photo Frame?</strong>
            <p>This is a browser-based photo display app that connects to Facebook and displays 
            photos uploaded by the Facebook user account</p>
            <strong>Is it safe to link my Facebook account to this app?</strong>
            <p>While the codes are stored on a public server on the Internet, the server does
            little more than host them for the browser to download. Simply put, neither your account
            information nor your selection preferences are stored in the server.</p>
            <strong>I don't believe you. Show me your codes!</strong>
            <p>Check them out <a href="https://github.com/jhfoo/smartphotoframe">on GitHub</a>!</p>
          </div>
          <div className="six wide column">
              Identify yourself<br/><br/>
              <a onClick={()=>{this.props.onLogin()}} className="fluid ui primary button"><i className="facebook icon"></i> Facebook Login</a>
              <br/><br/>
              <div id="status">No registration required.</div>
          </div>
        </div>
      </div>
    );   
  }

  render() {
    var ContentStyle = {
      position: 'absolute',
      top: '40px',
      left: 0,
      right: 0,
      bottom: 0
    }, BackgroundPhotoContainerStyle = {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      overflow: 'hidden',
      backgroundColor: '#000'
    }, BackgroundPhotoStyle = {
      position: 'absolute',
      top: 0,
      left: 0,
      opacity: 0
    }, SegmentStyle = {
      maxWidth: '600px'
    };

    if (this.props.UserId !== '') {
      return null;
    }
    else return (
      <div>
        <div style={BackgroundPhotoContainerStyle}>
          <img id="BgImage" src={'/images/' + Config.login.PhotoUrls[0]}/>
        </div>
        <div style={ContentStyle}>
          <div className="ui container">
            <div className="ui grid">
              <div className="five wide column"></div>
              <div className="eleven wide column">
                <br/>
                <div style={SegmentStyle} className="ui raised segments">
                  {this.renderMainSegment()}
                  <div className="ui right aligned inverted tertiary segment">
                    Photos from <a href="https://www.pexels.com">Pexels</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}