
'use strict';


var Gallery = function(data) {
  this.pictures = data;
 /* this.gallery;
  this.startingPicture;*/
  var self = this;

  /*this.saveInputData = function(data) {
    this.pictures = data;
  };*/

  this.showGallery = function(pictureData) {
    for (var i = 0; i < this.pictures.length; i++) {
      if (!(pictureData.url.indexOf(this.pictures[i].url) == -1)) {
        this.startingPicture = i;
        break;
      }
    }
    this.gallery = document.querySelector('.gallery-overlay');
    this.gallery.classList.remove('invisible');
    this.imgTag = this.gallery.querySelector('img');
    this.imgTag.setAttribute('src', this.pictures[this.startingPicture].url);
    this.gallery.querySelector('.likes-count').textContent = this.pictures[this.startingPicture].likes;
    this.gallery.querySelector('.comments-count').textContent = this.pictures[this.startingPicture].comments;
    window.addEventListener('keyup', this._onDocumentKeyDown);
    this.gallery.addEventListener('click', this._onOverlayClick);
    this.gallery.querySelector('.gallery-overlay-image').addEventListener('click', this._onPhotoClick);
  };

  this._onPhotoClick = function() {
    self.startingPicture++;
    if (self.startingPicture > self.pictures.length) {
      self.startingPicture = 0;
    }
    self.showGallery(self.pictures[self.startingPicture]);
  };

  this._onDocumentKeyDown = function(evt) {
    if (evt.keyCode == '27') {
      self.closeGallery();
    }
  };

  this._onOverlayClick = function(evt) {
    if (evt.target.classList.contains('gallery-overlay') || event.target.classList.contains('gallery-overlay-close')) {
      self.closeGallery();
    }
  };
  this.closeGallery = function() {
    self.gallery.classList.add('invisible');
  };
};

module.exports = Gallery;


/*
var showGallery = function(pictureData) {
  for (var i = 0; i < pictures.length; i++) {
    if (!(pictureData.url.indexOf(pictures[i].url) == -1)) {
      startingPicture = i;
      break;
    }
  }
  gallery = document.querySelector('.gallery-overlay');
  gallery.classList.remove('invisible');
  var imgTag = gallery.querySelector('img');
  imgTag.setAttribute('src', pictures[startingPicture].url);
  gallery.querySelector('.likes-count').textContent = pictures[startingPicture].likes;
  gallery.querySelector('.comments-count').textContent = pictures[startingPicture].comments;
  window.addEventListener('keyup', _onDocumentKeyDown);
  gallery.addEventListener('click', _onOverlayClick);
  gallery.querySelector('.gallery-overlay-image').addEventListener('click', _onPhotoClick);
};

var _onPhotoClick = function() {
    startingPicture++;
    if (startingPicture > pictures.length) {
      startingPicture = 0;
    }
    showGallery(pictures[startingPicture]);
};

var _onDocumentKeyDown = function(evt) {
    if (evt.keyCode == '27') {
      closeGallery();
    }
};

var _onOverlayClick = function(evt) {
    if (evt.target.classList.contains('gallery-overlay') || event.target.classList.contains('gallery-overlay-close')) {
      closeGallery();
    }
};
var closeGallery = function() {
  gallery.classList.add('invisible');
};


module.exports = {
  showGallery: showGallery,
  saveInputData: saveInputData
};
*/
