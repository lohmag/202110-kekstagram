'use strict';


var Gallery = function() {

    this.startingPicture = 0;
    var self = this;

    this.setParams = function(data) {
      this.pictures = data;
    };

  /*  this.setHash = function(pictureData) {
      for (var i = 0; i < self.pictures.length; i++) {
        if (!(pictureData.url.indexOf(self.pictures[i].url) == -1)) {
          location.hash = self.pictures[i].url;
          break;
        }
      }
    };*/

    /*this.showGallery = function(pictureData) {
      if (typeof pictureData == "number") {
        self.startingPicture = pictureData;
        self._fillPicture(self.pictures[this.startingPicture]);
        self.startingPicture = pictureData;
      }
      else if (typeof pictureData == "string") {
        for (var i = 0; i < self.pictures.length; i++) {
          if (!(self.pictures[i].url.indexOf(pictureData) == -1)) {
            self._fillPicture(self.pictures[i]);
            self.startingPicture = i;
            break;
          }
        }
      }
    };*/

    this._fillPicture = function(picture) {
      location.hash = picture.url;
      self.gallery = document.querySelector('.gallery-overlay');
      self.gallery.classList.remove('invisible');
      self.imgTag = self.gallery.querySelector('img');
      self.imgTag.setAttribute('src', picture.url);
      self.gallery.querySelector('.likes-count').textContent = picture.likes;
      self.gallery.querySelector('.comments-count').textContent = picture.comments;
      window.addEventListener('keyup', self._onDocumentKeyDown.bind(this));
      self.gallery.addEventListener('click', self._onOverlayClick.bind(this));
      self.gallery.querySelector('.gallery-overlay-image').addEventListener('click', self._onPhotoClick);
    };

   /* this._onHashChange = function() {
      window.addEventListener('hashchange', function() {
        if (this.found = location.hash.match(/#photos\/(\S+)/)) {
          self.showGallery(this.found[0].substr(1));
        }
      })
    };*/

    this._onPhotoClick = function() {
      self.startingPicture++;
      if (self.startingPicture > self.pictures.length) {
        self.startingPicture = 0;
      }
      self.showGallery(self.startingPicture);
    };

/*    this._onDocumentKeyDown = function(evt) {
      if (evt.keyCode == '27') {
        location.hash = '';
        self.closeGallery();
      }
    };*/

/*
    this._onOverlayClick = function(evt) {
      if (evt.target.classList.contains('gallery-overlay') || event.target.classList.contains('gallery-overlay-close')) {
        location.hash = '';
        self.closeGallery();
      }
    };
    this.closeGallery = function() {
      self.gallery.classList.add('invisible');
    };
*/

  window.addEventListener('hashchange', this._onHashChange.bind(this));
  window.addEventListener('pageshow', this._onHashChange.bind(this));
  };

Gallery.prototype.setHash = function(pictureData) {
  for (var i = 0; i < this.pictures.length; i++) {
    if (!(pictureData.url.indexOf(this.pictures[i].url) == -1)) {
      location.hash = this.pictures[i].url;
      break;
    }
  }
};


Gallery.prototype.showGallery = function(pictureData) {
  if (typeof pictureData == "number") {
    this.startingPicture = pictureData;
    this._fillPicture(this.pictures[this.startingPicture]);
    this.startingPicture = pictureData;
  }
  else if (typeof pictureData == "string") {
    for (var i = 0; i < this.pictures.length; i++) {
      if (!(this.pictures[i].url.indexOf(pictureData) == -1)) {
        this._fillPicture(this.pictures[i]);
        this.startingPicture = i;
        break;
      }
    }
  }
};

/*Gallery.prototype._fillPicture = function(picture) {
  location.hash = picture.url;
  this.gallery = document.querySelector('.gallery-overlay');
  this.gallery.classList.remove('invisible');
  this.imgTag = this.gallery.querySelector('img');
  this.imgTag.setAttribute('src', picture.url);
  this.gallery.querySelector('.likes-count').textContent = picture.likes;
  this.gallery.querySelector('.comments-count').textContent = picture.comments;
  window.addEventListener('keyup', this._onDocumentKeyDown.bind(this));
  this.gallery.addEventListener('click', this._onOverlayClick.bind(this));
  this.gallery.querySelector('.gallery-overlay-image').addEventListener('click', this._onPhotoClick.bind(this));
};*/

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
  if (evt.keyCode == '27') {
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
  this.gallery.classList.add('invisible');
};

module.exports = new Gallery;
