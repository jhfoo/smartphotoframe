import React from 'react';
import moment from 'moment';
import Promise from 'bluebird';

/* global $ */

// stateless functional Component
export default class PhotosContainer extends React.Component {
  constructor(props) {
    super(props);
    this.wait4Images2Load = this.wait4Images2Load.bind(this);
    this.areImagesLoaded = this.areImagesLoaded.bind(this);
    this.flipPhoto = this.flipPhoto.bind(this);
    this.onSelectMenu = this.onSelectMenu.bind(this);
    this.state = {
      timer: null,
      DisplayIndex: 0
    };
  }

  onSelectMenu() {
    var carousel = $('.carousel');
    console.log(carousel.css('zIndex'));
    if (parseInt(carousel.css('zIndex')) === 100)
      carousel.css('zIndex',110);
    else 
      carousel.css('zIndex',100);
  }

  wait4Images2Load() {
    var self = this;
    return new Promise((resolve, reject) => {
      self.areImagesLoaded(resolve, reject);
    });
  }
  areImagesLoaded(resolve, reject) {
    var self = this;
    if (this.props.photos.length === 0) 
      return true;

    var images = $('.carousel img'); 
//    for (var index = 0; index < 1; index++) {
    for (var index = 0; index < images.length; index++) {
        var img = images[index]; 
        // console.log(img.prop('complete') ? true:false);
        if (!img.complete) {
          setTimeout(() => {
            self.areImagesLoaded(resolve, reject);
          },500);
          return;
        }
    }

    resolve();
  }
  componentDidUpdate() {
    if (!this.props.isShowPhotos)
      return;

    var parent = $('.carousel');
    var ParentAspectRatio = parent.width() / parent.height();

    this.wait4Images2Load()
    .then(() => {
      console.log('Images loaded');
      var images = $('.carousel img');

      // scale images to fit the screen 
      images.each((index) => {
        var ThisImage = images[index];
        var ImgAspectRatio = ThisImage.naturalWidth / ThisImage.naturalHeight;
        if (ImgAspectRatio <= ParentAspectRatio)
          $(ThisImage).width(parent.width());
        else
          $(ThisImage).height(parent.height());
      });
      if (this.state.timer) {
        clearTimeout(this.state.timer);
        this.state.timer - null;
      }

      this.flipPhoto();
    });
  }
  flipPhoto() {
    if (!this.props.isShowPhotos 
      || this.props.photos.length === 0)
      return;

    var self = this,
      TotalImageDuration = 8000,
      SlideDuration = 8000,
      FadeDuration = 1000;

    // prepare next image block
    var NextDisplayIndex = this.state.DisplayIndex+1 > this.props.photos.length
      ? 1
      : this.state.DisplayIndex + 1;
    var NewImageBlock = $('.carousel > div:nth-child(' + NextDisplayIndex + ')');

    NewImageBlock.css('top', 0).css('left', 0);    

    // set initial position
    if (this.state.DisplayIndex > -1) {
      $('.carousel > div:nth-child(' + this.state.DisplayIndex + ')').animate({
        opacity: 0
      }, FadeDuration);
    }

    this.state.DisplayIndex = NextDisplayIndex; 
      
    NewImageBlock.animate({
      opacity: 1
    }, FadeDuration, () => {
      if (NewImageBlock.width() > NewImageBlock.parent().width()) {
        var DeltaX = NewImageBlock.width() - NewImageBlock.parent().width();
        NewImageBlock.animate({
          // slide left
          left: '-=' + DeltaX
        },SlideDuration, () => {
          this.state.timer = setTimeout(function() {
            self.flipPhoto();
          }, TotalImageDuration - SlideDuration);
        });        
      } else {
        var DeltaY = NewImageBlock.height() - NewImageBlock.parent().height();
        NewImageBlock.animate({
          // slide left
          top: '-=' + DeltaY
        },SlideDuration, () => {
          this.state.timer = setTimeout(function() {
            self.flipPhoto();
          }, TotalImageDuration - SlideDuration);
        });        
      }
    });
  }
  render() {
    if (!this.props.isShowPhotos) {
      console.log('Stopping photo run');
      $('.carousel div').stop (true, false);
      return null;
    }

    if (!this.props.photos.length)
      return null;

      // var cards = this.props.photos.map((item) => {
      //   item.CreatedTime = moment(item.created_time).format('D MMM, YYYY');
      //   return (
      //     <div key={item.id} className="card">
      //       <div className="image">
      //         <img src={item.images[0].source}/>
      //       </div>
      //       <div className="content">
      //         <div className="header">
      //           {item.CreatedTime}
      //         </div>
      //         <div className="meta">
      //           {item.from.name}
      //         </div>
      //         <div className="description">
      //           {item.name}
      //         </div>
      //       </div>
      //     </div>
      //   );
      // });
    var PhotoStyle = {
      position: 'absolute',
      top: 0,
      left: 0,
      opacity: 0
    }, CarouselStyle = {
      position: 'absolute',
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      overflow: 'hidden',
      backgroundColor:'black',
      zIndex: 110
    }, SecretMenuStyle = {
      position: 'absolute',
      right: 0,
      bottom: 0,
      width: '140px',
      height: '60px',
      zIndex: 120
    };

    var photos = this.props.photos.map((item) => {
      item.CreatedTime = moment(item.created_time).format('D MMM, YYYY');
      return (
        <div key={item.id} style={PhotoStyle}><img src={item.images[0].source}/></div>
      );
    });

    return (
      <div style={CarouselStyle} className="carousel">
        {photos}
        <div style={SecretMenuStyle} className="SecretMenu">
          <div onClick={this.onSelectMenu} className="ui primary button"><i className="content icon"></i> Menu</div>
        </div>
      </div>
    );
  }
}