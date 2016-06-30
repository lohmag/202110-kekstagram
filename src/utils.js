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




module.exports = {
  isBottomReached: isBottomReached,
  isNextPageAvailable: isNextPageAvailable
};
