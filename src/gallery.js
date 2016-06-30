
'use strict';

var pictures = [];
var gallery;
var startingPicture;

var saveInputData = function(data) {
  pictures = data;
};

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
