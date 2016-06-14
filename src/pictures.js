/**
 * Created by Nikita on 08.06.2016.
 */
'use strict';

var AJAX_SERVER_URL = 'https://o0.github.io/assets/json/pictures.json';
var filters = document.querySelector('.filters');
filters.classList.add('hidden');

var getPictureClone = function(data, container) {
  var pictureClone;
  var templatePicture = document.querySelector('#picture-template');
  if ('content' in templatePicture) {
    pictureClone = templatePicture.content.querySelector('.picture');
  } else {
    pictureClone = templatePicture.querySelector('.picture');
  }
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

var getPictures = function(callback) {
  var pictureContainer = document.querySelector('.pictures');
  var pictures;
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
    pictures = setFilters(filters, pictures);
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
  var pictureContainer = document.querySelector('.pictures');
  pictures.forEach(function(picture) {
    getPictureClone(picture, pictureContainer);
  });
};

var setFilters = function(filter, pictures) {
  var picturesDefault = pictures.slice(0);
  filter.classList.remove('hidden');
  var filtersRadio = document.getElementsByName('filter');
  for (var i = 0; i < filtersRadio.length; i++) {
    if (filtersRadio[i].type === 'radio' && filtersRadio[i].checked) {
      switch (filtersRadio[i].id) {
        case 'filter-popular':
          return picturesDefault;
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
          return picturesForLast4Days;
        case 'filter-discussed':
          pictures.sort(function(a, b) {
            return b.comments - a.comments;
          });
          return pictures;
      }
    }
  }
  return 1;
};

var changeFilters = function() {
  var filtersRadio = document.getElementsByName('filter');
  for (var i = 0; i < filtersRadio.length; i++) {
    filtersRadio[i].onclick = function() {
      this.checked = true;
      getPictures(renderPictures);
    };
  }
};

changeFilters();
getPictures(renderPictures);
