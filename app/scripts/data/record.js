'use strict';

/**
 * Simple structure to represent one record in our trace
 * @param {Float} startTime when this record starts in time
 */
function Record(startTime) {
  this.start = startTime || 0;

  this.name = '';
  this.category = '';
  this.color = '';

  this.totalTime = 0;
  this.ownTime = 0;

  this.setTime();
  this.setType();

  this.end = this.start + this.totalTime;
}

/**
 * Creates a random duration for the record
 */
Record.prototype.setTime = function () {
  var max = 20;
  var min = 1;
  this.totalTime = Math.random() * (max - min) + min;
  this.ownTime = Math.random() * (this.totalTime - this.totalTime/2) + this.totalTime/2;
};

/**
 * Randomly chooses the type of record.
 * For simplicity reasones, idling is also a type
 */
Record.prototype.setType = function () {
  var types = [
    { name: 'Event', category: 'Scripting', color: '#f3d27c' },
    { name: 'Timer Fired', category: 'Scripting', color: '#f3d27c' },
    { name: 'Function Call', category: 'Scripting', color: '#f3d27c' },
    { name: 'Paint', category: 'Painting', color: '#74b266' },
    { name: 'Composite Layers', category: 'Painting', color: '#74b266' },
    { name: 'Recalculate Styles', category: 'Rendering', color: '#9b7fe6' },
    { name: 'Parse HTML', category: 'Loading', color: '#6ea1e3' },
    { name: 'Idle', category: 'Idle', color: '#ffffff' },
  ];

  var type = types[Math.floor(Math.random() * 8)];

  this.name = type.name;
  this.category = type.category;
  this.color = type.color;
};

module.exports = Record;