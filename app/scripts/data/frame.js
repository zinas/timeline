'use strict';

var Record = require('./record');

/**
 * Simple structure to represent one event
 * @param {Float} startTime when this frame starts in time
 */
function Frame(startTime) {
  this.records = [];
  this.start = startTime || 0;
  this._maxRecords = 5;

  this.generateRecords();

  this.maxTime = 0;
  this.totalTime = this.getTime();
  this.end = this.start + this.totalTime;
}

/**
 * Randomly generates the records of this event
 */
Frame.prototype.generateRecords = function () {
  var
    recordsNum = parseInt(Math.random() * (this._maxRecords - 1) + 1),
    currentTime = this.start,
    record, i;

  for ( i=0; i < recordsNum; i++ ) {
    record = new Record(currentTime);
    this.records.push(record);
    currentTime = currentTime + record.totalTime;
    this.maxTime = this.maxTime > record.totalTime ? this.maxTime : record.totalTime;
  }
};

/**
 * Returns the total time this frame will need
 * @return {Float}
 */
Frame.prototype.getTime = function () {
  var totalTime = 0;
  this.records.forEach(function (val) {
    totalTime = totalTime + val.totalTime;
  }, this);

  return totalTime;
};

module.exports = Frame;