import React from 'react';

/* global $ */

// stateless functional Component
export default class LoginContainer extends React.Component {
  onToggleFaq() {
    if ($('#ToggleFaq').css('display') === 'block')
      $('#ToggleFaq').css('display','none');
    else
      $('#ToggleFaq').css('display','block');
  }
  render() {
    var TextStyle={
      textAlign: 'left',
      maxHeight: '350px',
      overflow: 'auto'
    }, ContentStyle = {
      position: 'absolute',
      top: '40px',
      left: 0,
      right: 0,
      bottom: 0
    };

    if (this.props.UserId !== '')
      return null;
    else return (
      <div style={ContentStyle}>
        <div className="ui container">
          <div className="ui grid">
            <div className="two wide column"></div>
            <div className="twelve wide column">
              <br/>
              <div className="ui blue raised segment">
                <div className="ui stackable two column grid">
                  <div className="column" style={TextStyle}>
                    <strong>What is Smart Photo Frame?</strong>
                    <p>This is a browser-based photo display app that connects to Faccebook and displays 
                    photos uploaded by the Facebook user account</p>
                    <strong>Is it safe to link my Facebook account to this app?</strong>
                    <p>While the codes are stored on a public server on the Internet, the server does
                    little more than host them for the browser to download. Simply put, neither your account
                    information nor your selection preferences are stored in the server.</p>
                    <strong>I don't believe you. Show me your codes!</strong>
                    <p>I may be putting up all source on GitHub. Stay tuned!</p>
                    <strong>Tell me more about why and how you did this.</strong>
                    <p>I'm glad you asked! <a onClick={() => {this.onToggleFaq()}}>Click here</a> to see more.</p>
                    <div id="ToggleFaq" style={{display:'none'}}>
                      <strong>What tech did you employ in this?</strong>
                      <p>I'm tired. Tell you later.</p>
                    </div>
                  </div>
                  <div className="column">
                      Identify yourself<br/><br/>
                      <a onClick={()=>{this.props.onLogin()}} className="ui primary button"><i className="facebook icon"></i> Facebook Login</a>
                      <br/><br/>
                      <div id="status">There's only one way to login.</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="two wide column"></div>
          </div>
        </div>
      </div>
    );
  }
}