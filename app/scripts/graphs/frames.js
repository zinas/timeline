'use strict';

var d3 =
  require('../../bower_components/d3/d3'),
  utils = require('../lib/utils');

/**
 * Wraps up all the functionality around the
 * frames representation
 * @param {Array}  data       frames array
 * @param {Object} dimensions width and height to use
 */
function Graph(data, dimensions) {
  this.frames = data.frames;
  this.totalTime = data.totalTime;
  this.maxTime = data.maxTime;
  this.width = dimensions.width;
  this.height = dimensions.height;

  this.init();
};

Graph.prototype.init = function () {
  this.initScales();
  this.initAxis();
};

Graph.prototype.initScales = function () {
  this.scales = {};

  this.scales.x =
    d3.scale.linear()
      .domain([0, this.totalTime])
      .range([0, this.width]);

  this.scales.y =
    d3.scale.linear()
      .domain([0, this.maxTime])
      .range([0, this.height]);
};

Graph.prototype.initAxis = function () {
  this.axis = {};
  this.axis.x = d3.svg.axis().scale(this.scales.x).orient('bottom').tickFormat(utils.formatMs);
};

Graph.prototype.appendTo = function (root) {
  var self = this;

  this.graph =
    root
      .append('g')
      .attr('width', this.width)
      .attr('height', this.height)
      .attr('class', 'framesGraph');

  this.graph.append('g')
    .attr('class', 'x axis')
    .attr('transform', 'translate(0,' + this.height + ')')
    .call(this.axis.x);

  var barWidth = this.width / this.frames.length;
  this.frames.forEach(function (frame, i) {
    var scale = d3.scale.linear().domain([0, this.maxTime]).range([0, this.height]);
    this.graph
      .append('g')
      .attr('transform', 'translate('+(barWidth*i)+','+(this.height-scale(frame.totalTime))+')')
      .attr('class', 'frame'+i)
      .attr('width', barWidth-3)
      .attr('height', this.height)

      .selectAll('rect')
      .data(frame.records)
      .enter()
      .append('rect')
      .attr('y', function (record) {
        return scale(record.start - frame.start);
      })
      .attr('height', function (record) {
        return scale(record.end) - scale(record.start);
      })
      .attr('width', barWidth-3)
      .attr('fill', function (record) {
        return record.color === '#ffffff' ? '#dddddd' : record.color;
      });
  }, this);
};



module.exports = Graph;
