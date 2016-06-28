
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
};

var _onPhotoClick = function() {
  gallery.querySelector('.gallery-overlay-image').addEventListener('click', function(evt) {
    startingPicture++;
    if (startingPicture > pictures.length) {
      startingPicture = 0;
    }
    showGallery(startingPicture);
  })
};

var _onDocumentKeyDown = function() {
  window.addEventListener('keyup', function(evt) {
    if (evt.keyCode == '27') {
      gallery.classList.add('invisible');
    }
  })
};

var _onOverlayClick = function() {
  gallery.addEventListener('click', function(evt) {
    if (evt.target.classList.contains('gallery-overlay') || evt.target.classList.contains('gallery-overlay-close')) {
      gallery.classList.add('invisible');
    }
  })
};

var init = function(pictures, pictureNumber) {
  showGallery(pictureNumber);
  _onPhotoClick();
  _onDocumentKeyDown();
  _onOverlayClick();
};

module.exports = {
  init: init,
  saveInputData: saveInputData
};