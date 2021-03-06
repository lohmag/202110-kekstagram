/**
 * Created by Nikita on 08.06.2016.
 */
'use strict';

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
  container.appendChild(clone);
  return clone;
};

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
    filteredPictures = setFilters(filters, pictures);
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
  setScrollEnabled();
};

var isBottomReached = function() {
  var GAP = 100;
  var footerElement = document.querySelector('footer');
  var footerPosition = footerElement.getBoundingClientRect();
  return footerPosition.top - window.innerHeight - GAP <= 0;
};

var isNextPageAvailable = function(picturesx, page, pageSize) {
  return page < Math.floor(picturesx.length / pageSize);
};

var setScrollEnabled = function() {
  var lastCall = Date.now();

  window.addEventListener('scroll', function() {
    if (Date.now() - lastCall >= THROTTLE_DELAY) {
      console.log('scroll event');
      if (isBottomReached() && isNextPageAvailable(pictures, pageNumber, pictureVolume)) {
        pageNumber++;
        renderPictures(filteredPictures, pageNumber);
      }
    }
  });
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
};

var renderPictures = function(picturesy, page) {
  var pictureContainer = document.querySelector('.pictures');
  var from = page * pictureVolume;
  var to = from + pictureVolume;
  if (typeof picturesy !== 'undefined' && picturesy.length > 0) {
    picturesy.slice(from, to).forEach(function(picture) {
      getPictureClone(picture, pictureContainer);
    });
  } else {
    emptyPictures(pictureContainer);
  }
};

var setFilters = function(filter, picturesz) {
  var label;
  var returnArray;
  pageNumber = 0;
  var picturesDefault = picturesz.slice(0);
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
          var picturesForLast4Days = picturesz.filter(function(picture) {
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
          var picturesDiscussed = picturesz.sort(function(a, b) {
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

var changeFilters = function() {
  //var filtersRadio = document.getElementsByName('filter');
  filters.addEventListener('click', function(evt) {
    if (evt.target.classList.contains('filters-radio')) {
      evt.target.checked = true;
      getPictures(renderPictures);
    }
  });
};

setPictureVolume();
changeFilters();
getPictures(renderPictures);
