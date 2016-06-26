/**
 * Created by Nikita on 08.06.2016.
 */
'use strict';

var utils = require ('./utils');

var AJAX_SERVER_URL = 'https://o0.github.io/assets/json/pictures.json';
var filters = document.querySelector('.filters');
filters.classList.add('hidden');
/** @constant {number} */
var pictureVolume = 12;
/** @type {number} */
var pageNumber = 0;
/** @type {Array.<Object>} */
var pictures = [];
/** @type {Array.<Object>} */
var filteredPictures = [];
/** @type {number} */
var THROTTLE_DELAY = 1000;



var selectTemplate = function() {
  return document.querySelector('#picture-template');
};

var emptyPictures = function(container) {
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
  container.appendChild(clone);
  return clone;
};

var getPictures = function(callback) {
  var pictureContainer = document.querySelector('.pictures');
  pictureContainer.innerHTML = '';
  var xhr = new XMLHttpRequest();
  xhr.open('GET', AJAX_SERVER_URL);
  xhr.loadstart = function() {
    pictureContainer.classList.add('pictures-loading');
  };
  xhr.onload = function(evt) {
    pictureContainer.classList.remove('pictures-loading');
    var requestObj = evt.target;
    var response = requestObj.response;
    pictures = JSON.parse(response);
    filteredPictures = utils.setFilters(filters, pictures);
    callback(filteredPictures, pageNumber);
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
  utils.setScrollEnabled(filteredPictures, pageNumber, pictureVolume, renderPictures);
  //setScrollEnabled();
};

var setPictureVolume = function() {
  var imgClone;
  var templatePicture = selectTemplate();
  if ('content' in templatePicture) {
    imgClone = templatePicture.content.querySelector('img');
  } else {
    imgClone = templatePicture.querySelector('img');
  }
  var vol = Math.ceil((window.innerHeight / imgClone.height - 3) * 7 + 12);
  if (vol < 12) {
    pictureVolume = 12;
  } else {
    pictureVolume = vol;
  }
  return pictureVolume;
};

var renderPictures = function(picturesy, page) {
  var pictureContainer = document.querySelector('.pictures');
  var from = page * pictureVolume;
  var to = from + pictureVolume;
  if (typeof picturesy !== 'undefined' && picturesy.length > 0) {
    picturesy.slice(from, to).forEach(function(picture) {
      utils.getPictureClone(picture, pictureContainer);
    });
  } else {
    emptyPictures(pictureContainer);
  }
};

var changeFilters = function() {

  filters.addEventListener('click', function(evt) {
    if (evt.target.classList.contains('filters-radio')) {
      pageNumber = 0;
      evt.target.checked = true;
      getPictures(renderPictures);
    }
  });
};

setPictureVolume();
changeFilters();
getPictures(renderPictures);
