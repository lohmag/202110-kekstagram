/**
 * Created by nmass on 03.06.2016.
 */
'use strict';


var upload = require('./upload');
var pictures = require('./pictures');

upload.cleanupResizer();
upload.updateBackground();
upload.validateForm();
upload.setUploadFilterDefault();
upload.resizerChange();

pictures.setPictureVolume();
pictures.changeFilters();
pictures.getPictures(pictures.renderPictures);

