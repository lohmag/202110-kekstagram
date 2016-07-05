/**
 * Created by nmass on 30.06.2016.
 */

'use strict';


var Photo = function(data, container, Gallery) {
  this.data = data;
  this.element = getPictureClone(this.data);
  this.gallery = Gallery;

  this.element.addEventListener('click', this.onClick.bind(this));
  container.appendChild(this.element);
};

Photo.prototype.onClick = function(evt) {
  evt.preventDefault();
  this.gallery.setHash(this.data)
};

Photo.prototype.remove = function() {
  this.element.removeEventListener('click', this.onClick);
  this.element.parentNode.removeChild(this.element);
};

var Empty = function(container) {
  this.element = emptyPictures();
  this.element.addEventListener('click', this.onClick.bind(this));
  container.appendChild(this.element);
};

Empty.prototype.onClick = function(evt) {
  evt.preventDefault();
};

Empty.prototype.remove = function() {
  this.element.parentNode.removeChild(this.element);
};

var getPictureClone = function(data) {
  var pictureClone;
  var templatePicture = selectTemplate();
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

var emptyPictures = function() {
  var pictureClone;
  var templatePicture = selectTemplate();
  if ('content' in templatePicture) {
    pictureClone = templatePicture.content.querySelector('.picture');
  } else {
    pictureClone = templatePicture.querySelector('.picture');
  }
  var clone = pictureClone.cloneNode(true);
  var message = document.createElement('p');
  message.innerHTML = 'Нет картинок по данному фильтру';
  clone.replaceChild(message, clone.querySelector('img'));
  return clone;
};

var selectTemplate = function() {
  return document.querySelector('#picture-template');
};
module.exports = {
  Photo: Photo,
  Empty: Empty
};
