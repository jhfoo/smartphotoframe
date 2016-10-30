import React from 'react';
import moment from 'moment';

/* global $ */

// stateless functional Component
export default class AlbumsContainer extends React.Component {
  renderCards(albums) {
    return albums.map((item) => {
      item.UpdatedTime = moment(item.updated_time).format('D MMM, YYYY');

      // <img src={item.images[0].source}/>
      return (
        <div key={item.id} className="card">
          <div className="image">
          </div>
          <div className="content">
            <div className="header">
              {item.name}
            </div>
            <div className="meta">
              {item.CreatedTime}
            </div>
            <div className="description">
              {item.count} photos
            </div>
          </div>
          <div onClick={() => {this.props.onSelectAlbum(item.id)}} className="ui bottom attached button">
            <i className="add icon"></i> Select
          </div>
        </div>
      );
    });
  }
  render() {
    if (this.props.albums.length === 0)
      return null;

    // else
    var CardContainerStyle = {
      padding: '10px'
    }, ContentStyle = {
      position: 'absolute',
      top: '40px',
      left: 0,
      right: 0,
      bottom: 0
    };

    return (
      <div style={ContentStyle}>
        <div style={CardContainerStyle}>
          <div className="ui cards">
            {this.renderCards(this.props.albums)}
          </div>
        </div>
      </div>
    );
  }
}