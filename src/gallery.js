
'use strict';

var pictures = [];
var gallery;
var startingPicture;

var saveInputData = function(data) {
  pictures = data;
};

var showGallery = function(pictureNumber) {
  startingPicture = pictureNumber;
  gallery = document.querySelector('.gallery-overlay');
  gallery.classList.remove('invisible');
  var imgTag = gallery.querySelector('img');
  imgTag.setAttribute('src', pictures[pictureNumber].url);
  gallery.querySelector('.likes-count').textContent = pictures[pictureNumber].likes;
  gallery.querySelector('.comments-count').textContent = pictures[pictureNumber].comments;
  window.addEventListener('keyup', _onDocumentKeyDown);
  gallery.addEventListener('click', _onOverlayClick);
  gallery.querySelector('.gallery-overlay-image').addEventListener('click', _onPhotoClick);
};

var _onPhotoClick = function() {
    startingPicture++;
    if (startingPicture > pictures.length) {
      startingPicture = 0;
    }
    showGallery(startingPicture);
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
