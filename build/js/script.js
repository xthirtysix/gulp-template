"use strict";

var WEB_P_HEIGHT = 2;

var defineWebpSupport = function defineWebpSupport(cb) {
  var webp = new Image();

  webp.onload = webp.onerror = function () {
    cb(webp.height == WEB_P_HEIGHT);
  };

  webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
};

defineWebpSupport(function (support) {
  if (support) {
    document.querySelector('body').classList.add('webp');
  } else {
    document.querySelector('body').classList.add('no-webp');
  }
});