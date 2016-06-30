/**
 * Created by nmass on 30.06.2016.
 */

'use strict';

var Gallery = require('../gallery.js');

var Photo = function(data, container) {
  this.data = data;
  this.element = getPictureClone(this.data, container);
  var self = this;

  this.onClick = function(evt) {
      evt.preventDefault();
      Gallery.showGallery(self.data);
  };

  this.remove = function() {
    this.element.removeEventListener('click', this.onClick);
    this.element.parentNode.removeChild(this.element);
  };

  this.element.addEventListener('click', this.onClick);
  container.appendChild(this.element);
};

var getPictureClone = function(data, container) {
  var pictureClone;
  var templatePicture = document.querySelector('#picture-template');
  if ('content' in templatePicture) {
    pictureClone = templatePicture.content.querySelector('.picture');
  } else {
    pictureClone = templatePicture.querySelector('.picture');
  }
  var clone = pictureClone.cloneNode(true);
  var imgTag = clone.querySelector('img');
  clone.querySelector('.picture-comments').textContent = data.comments;
  clone.querySelector('.picture-likes').textContent = data.likes;
  var image = new Image(imgTag.Width, imgTag.Height);
  image.onerror = function() {
    clone.classList.add('picture-load-failure');
  };
  image.src = data.url;
  clone.replaceChild(image, imgTag);
  return clone;
};

module.exports = Photo;
