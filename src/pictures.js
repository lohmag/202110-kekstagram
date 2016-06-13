/**
 * Created by Nikita on 08.06.2016.
 */
'use strict';

var filters = document.querySelector('.filters');
var templatePicture = document.querySelector('#picture-template');
filters.className = 'filters hidden';
var pictureClone;
if ('content' in templatePicture) {
  pictureClone = templatePicture.content.querySelector('.picture');
} else {
  pictureClone = templatePicture.querySelector('.picture');
}
var getPictureClone = function(data, container) {
  var clone = pictureClone.cloneNode(true);
  clone.querySelector('.picture-comments').textContent = data.comments;
  clone.querySelector('.picture-likes').textContent = data.likes;
  var image = new Image(182, 182);
  image.onerror = function() {
    clone.classList.add('picture-load-failure');
  };
  image.src = data.url;
  clone.replaceChild(image, clone.querySelector('img'));
  container.appendChild(clone);
  return clone;
};
/*
window.pictures.forEach(function(picture) {
  getPictureClone(picture, pictureContainer);
});
*/
var getPictures = function(callback) {
  var pictureContainer = document.querySelector('.pictures');
  var pictures;
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://o0.github.io/assets/json/pictures.json');
  xhr.loadstart = function() {
    pictureContainer.classList.add('pictures-loading');
  };
  xhr.onload = function(evt) {
    pictureContainer.classList.remove('pictures-loading');
    var requestObj = evt.target;
    var response = requestObj.response;
    pictures = JSON.parse(response);
    callback(pictures);
  };
  xhr.error = function() {
    pictureContainer.classList.remove('pictures-loading');
    pictureContainer.classList.add('pictures-failure');
  };
  xhr.timeout = 10000;
  xhr.ontimeout = function() {
    pictureContainer.classList.remove('pictures-loading');
    pictureContainer.classList.add('pictures-failure');
  };
  xhr.send();
};
var renderPictures = function(pictures) {
  pictures.forEach(function(picture) {
    var pictureContainer = document.querySelector('.pictures');
    getPictureClone(picture, pictureContainer);
  });
};
getPictures(renderPictures);
