'use strict';

var Frame = require('./frame');

var frames = {};

/**
 * Emulates the fetching of data from a remote source.
 * Uses promises to make it asynchronous and more close
 * to real scenarios
 * @return {Deferred}
 */
frames.get = function () {
  return new Promise(function (resolve, reject) {
    var data = [], frame, currentTime = 0, maxTime = 0;

    for ( var i = 0; i < 100; i++ ) {
      frame = new Frame(currentTime);
      data.push(frame);
      currentTime = currentTime + frame.totalTime;
      maxTime = frame.totalTime > maxTime ? frame.totalTime : maxTime;
    }

    resolve({
      frames: data,
      maxTime: maxTime,
      totalTime: currentTime
    });
  });
};

module.exports = frames;