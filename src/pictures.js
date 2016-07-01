/**
 * Created by Nikita on 08.06.2016.
 */
'use strict';

var utils = require('./utils');
var Gallery = require('./gallery');
var Picture = require('./modules/addPicture');

var THROTTLE_DELAY = 100;
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
/** @type {DOM Element} */
var pictureContainer = document.querySelector('.pictures');
/** @type {Array.<Object>} */
var renderedPictures = [];



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

var setScrollEnabled = function(pictures, pageNumber, pictureVolume, callback) {
  var lastCall = Date.now();

  window.addEventListener('scroll', function() {
    if (Date.now() - lastCall >= THROTTLE_DELAY) {
      console.log('scroll event');
      if (utils.isBottomReached() && utils.isNextPageAvailable(pictures, pageNumber, pictureVolume)) {
        pageNumber++;
        callback(pictures, pageNumber);
      }
    }
  });
};

var clearPictureContainer = function() {
  renderedPictures.forEach(function(element) {
    element.remove();
  });
  renderedPictures = [];
};

var getPictures = function(callback) {
 // var pictureContainer = document.querySelector('.pictures');
  clearPictureContainer();
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
    filteredPictures = setFilters(filters, pictures);
    callback(filteredPictures, pageNumber);
    setScrollEnabled(filteredPictures, pageNumber, pictureVolume, callback);
   window.galleryObject = new Gallery(filteredPictures);
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

var setFilters = function(filter, pictures) {
  var label;
  var returnArray;
  pageNumber = 0;
  var picturesDefault = pictures.slice(0);
  filter.classList.remove('hidden');
  var filtersRadio = document.getElementsByName('filter');
  for (var i = 0; i < filtersRadio.length; i++) {
    if (filtersRadio[i].type === 'radio') {
      switch (filtersRadio[i].id) {
        case 'filter-popular':
          label = document.querySelector('#filter-popular ~ label');
          label.innerHTML = 'Популярные (' + picturesDefault.length + ')';
          if (filtersRadio[i].checked) {
            returnArray = picturesDefault;
          }
          break;
        case 'filter-new':
          var picturesForLast4Days = pictures.filter(function(picture) {
            var FourDayBefore = Date.now() - 345600000;
            var timestamp = new Date(picture.date);
            var difference = timestamp.getTime() - FourDayBefore;
            return difference >= 0 && difference;
          });
          picturesForLast4Days.sort(function(a, b) {
            var timestamp1 = new Date(a.date);
            var timestamp2 = new Date(b.date);
            return timestamp2.getTime() - timestamp1.getTime();
          });
          label = document.querySelector('#filter-new ~ label');
          label.innerHTML = 'Новые (' + picturesForLast4Days.length + ')';
          if (filtersRadio[i].checked) {
            returnArray = picturesForLast4Days;
          }
          break;
        case 'filter-discussed':
          var picturesDiscussed = pictures.sort(function(a, b) {
            return b.comments - a.comments;
          });
          label = document.querySelector('#filter-discussed ~ label');
          label.innerHTML = 'Обсуждаемые (' + picturesDiscussed.length + ')';
          if (filtersRadio[i].checked) {
            returnArray = picturesDiscussed;
          }
          break;
      }
    }
  }
  return returnArray;
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
  var from = page * pictureVolume;
  var to = from + pictureVolume;
  if (typeof picturesy !== 'undefined' && picturesy.length > 0) {
    picturesy.slice(from, to).forEach(function(picture) {
      renderedPictures.push(new Picture(picture, pictureContainer));
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



var init = function() {
  setPictureVolume();
  changeFilters();
  getPictures(renderPictures);
  openGallery();
};

module.exports = {
  init: init
};
