'use strict';

/**
 * Module for simple util functions
 * @type {Object}
 */
var utils = {

  /**
   * Formats a float number into an appropriate representation
   * of milliseconds
   * @param  {Float} ms value to format in ms
   * @return {String}
   */
  formatMs : function (ms) {
    if ( ms < 1000 ) {
      return ms.toFixed(2) + 'ms';
    } else {
      return (ms/1000).toFixed(2)+'sec';
    }
  }
};


module.exports = utils;