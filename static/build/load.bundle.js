/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports) {

	"use strict";

	$(document).ready(function () {
	  Date.prototype.format = function (format) {
	    var o = {
	      "M+": this.getMonth() + 1,
	      "d+": this.getDate(),
	      "h+": this.getHours(),
	      "m+": this.getMinutes(),
	      "s+": this.getSeconds(),
	      "q+": Math.floor((this.getMonth() + 3) / 3),
	      "S": this.getMilliseconds()
	    };
	    if (/(y+)/.test(format)) {
	      format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
	    };
	    for (var k in o) {
	      if (new RegExp("(" + k + ")").test(format)) {
	        format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
	      }
	    }
	    return format;
	  };
	  layer.config({ extend: 'extend/layer.ext.js' });

	  function loadJS(js, cb) {
	    var script = document.createElement('script');
	    script.src = js;
	    script.onload = cb;
	    document.head.appendChild(script);
	  }
	  loadJS('../static/libs/dhtmlx/codebase/dhtmlx_pro.js', function () {
	    loadJS('../static/build/app.bundle.js', null);
	  });
	});

/***/ }
/******/ ]);