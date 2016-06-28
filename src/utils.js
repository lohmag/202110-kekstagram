/**
 * Created by Nikita on 25.06.2016.
 */

'use strict';

/** @type {number} */



var isBottomReached = function() {
  var GAP = 100;
  var footerElement = document.querySelector('footer');
  var footerPosition = footerElement.getBoundingClientRect();
  return footerPosition.top - window.innerHeight - GAP <= 0;
};

var isNextPageAvailable = function(picturesx, page, pageSize) {
  return page < Math.floor(picturesx.length / pageSize);
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

module.exports = {
  getPictureClone: getPictureClone,
  isBottomReached: isBottomReached,
  isNextPageAvailable: isNextPageAvailable
};
