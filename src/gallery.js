'use strict';


var Gallery = function() {

  this.startingPicture = 0;
  this.gallery = document.querySelector('.gallery-overlay');

  window.addEventListener('hashchange', this._onHashChange.bind(this));
  window.addEventListener('pageshow', this._onHashChange.bind(this));
  window.addEventListener('keyup', this._onDocumentKeyDown.bind(this));
  this.gallery.addEventListener('click', this._onOverlayClick.bind(this));
  this.gallery.querySelector('.gallery-overlay-image').addEventListener('click', this._onPhotoClick.bind(this));
};

Gallery.prototype.setHash = function(pictureData) {
  for (var i = 0; i < this.pictures.length; i++) {
    if (!(pictureData.url.indexOf(this.pictures[i].url) === -1)) {
      location.hash = this.pictures[i].url;
      break;
    }
  }
};

Gallery.prototype._fillPicture = function(picture) {
  location.hash = picture.url;
  this.gallery.classList.remove('invisible');
  this.imgTag = this.gallery.querySelector('img');
  this.imgTag.setAttribute('src', picture.url);
  this.gallery.querySelector('.likes-count').textContent = picture.likes;
  this.gallery.querySelector('.comments-count').textContent = picture.comments;
};

Gallery.prototype.showGallery = function(pictureData) {
  if (typeof pictureData === 'number') {
    this.startingPicture = pictureData;
    this._fillPicture(this.pictures[this.startingPicture]);
  }
  else if (typeof pictureData === 'string') {
    for (var i = 0; i < this.pictures.length; i++) {
      if (!(this.pictures[i].url.indexOf(pictureData) === -1)) {
        this._fillPicture(this.pictures[i]);
        this.startingPicture = i;
        break;
      }
    }
  }
};

Gallery.prototype.setParams = function(data) {
  this.pictures = data;
};

Gallery.prototype._onPhotoClick = function() {
  this.startingPicture++;
  if (this.startingPicture > this.pictures.length) {
    this.startingPicture = 0;
  }
  this.showGallery(this.startingPicture);
};

Gallery.prototype._onHashChange = function() {
  if (this.found = location.hash.match(/#photos\/(\S+)/)) {
    this.showGallery(this.found[0].substr(1));
  }
};

Gallery.prototype._onDocumentKeyDown = function(evt) {
  if (evt.keyCode === '27') {
    location.hash = '';
    this.closeGallery();
  }
};

Gallery.prototype._onOverlayClick = function(evt) {
  if (evt.target.classList.contains('gallery-overlay') || event.target.classList.contains('gallery-overlay-close')) {
    location.hash = '';
    this.closeGallery();
  }
};

Gallery.prototype.closeGallery = function() {
  this.remove();
  this.gallery.classList.add('invisible');
};

Gallery.prototype.remove = function() {
  window.removeEventListener('keyup', this._onDocumentKeyDown.bind(this));
  this.gallery.removeEventListener('click', this._onOverlayClick.bind(this));
  this.gallery.querySelector('.gallery-overlay-image').removeEventListener('click', this._onPhotoClick.bind(this));
};


module.exports = new Gallery;
