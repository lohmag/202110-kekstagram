/**
 * Created by Nikita on 08.06.2016.
 */
'use strict';
var pictureContainer = document.querySelector('.pictures');
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
window.pictures.forEach(function(picture) {
  getPictureClone(picture, pictureContainer);
});
