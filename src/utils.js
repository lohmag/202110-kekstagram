/**
 * Created by Nikita on 25.06.2016.
 */

'use strict';

var THROTTLE_DELAY = 1000;


var isBottomReached = function() {
  var GAP = 100;
  var footerElement = document.querySelector('footer');
  var footerPosition = footerElement.getBoundingClientRect();
  return footerPosition.top - window.innerHeight - GAP <= 0;
};

var isNextPageAvailable = function(picturesx, page, pageSize) {
  return page < Math.floor(picturesx.length / pageSize);
};

var setScrollEnabled = function(pictures, pageNumber, pictureVolume, callback) {
  var lastCall = Date.now();

  window.addEventListener('scroll', function() {
    if (Date.now() - lastCall >= THROTTLE_DELAY) {
      console.log('scroll event');
      if (isBottomReached() && isNextPageAvailable(pictures, pageNumber, pictureVolume)) {
        pageNumber++;
        callback(pictures, pageNumber);
      }
    }
  });
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
  container.appendChild(clone);
  return clone;
};
var setFilters = function(filter, pictures) {
  var label;
  var returnArray;
  window.pageNumber = 0;
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
module.exports = {
  setFilters: setFilters,
  getPictureClone: getPictureClone,
  setScrollEnabled: setScrollEnabled
};
