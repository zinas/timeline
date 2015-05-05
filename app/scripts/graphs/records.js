'use strict';

var
  d3 = require('../../bower_components/d3/d3'),
  utils = require('../lib/utils');

/**
 * Wraps up all the functionality around the
 * records representation
 * @param {Array}  data       frames array
 * @param {Object} dimensions width and height to use
 */
function Graph(data, dimensions) {
  this.frames = data.frames;
  this.totalTime = data.totalTime;
  this.maxTime = data.maxTime;
  this.width = dimensions.width;
  this.height = dimensions.height;

  this.records = this.frames.reduce(function (a, b) {
    return a.concat(b.records);
  }, []);

  this.init();
};

Graph.prototype.init = function () {
  this.initScales();
  this.initAxis();

  this.tooltip = d3.select('body')
    .append('div')
    .attr('class', 'tip');
};

Graph.prototype.initScales = function () {
  this.scales = {};
  this.scales.x = d3.scale.linear().domain([0, this.totalTime]).range([0, this.width]);
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
    .attr('transform', 'translate(0,'+ (this.height+100) +')')
    .attr('class', 'recordsGraph');

  this.graph
    .append('g')
    .attr('class', 'x axis')
    .attr('transform', 'translate(0,20)')
    .call(this.axis.x);

  this.rects = this.graph.append('g').attr('clip-path', 'url(#clip)');
  this.createRects();
};

Graph.prototype.createRects = function (records) {
  var self = this;
  records = records || this.records;


  var rects = this.rects
    .selectAll('rect')
    .data(records)
    .attr('height', 20)
    .attr('class', 'hoverable')
    .attr('y', 0)
    .attr('x', function (record) {
      var start = record.start > self.scales.x.domain()[0] ? record.start : self.scales.x.domain()[0];
      return self.scales.x(start);
    })
    .attr('width', function (record) {
      var start = record.start > self.scales.x.domain()[0] ? record.start : self.scales.x.domain()[0];
      var end = record.end < self.scales.x.domain()[1] ? record.end : self.scales.x.domain()[1];
      var w = self.scales.x(end) - self.scales.x(start);
      return w > 0 ? w : 0;
    })
    .attr('fill', function (record) {
      return record.color;
    });

  rects
    .enter()
    .append('rect')
    .attr('height', 20)
    .attr('y', 0)
    .attr('class', 'hoverable')
    .attr('x', function (record) {
      var start = record.start > self.scales.x.domain()[0] ? record.start : self.scales.x.domain()[0];
      return self.scales.x(start);
    })
    .attr('width', function (record) {
      var start = record.start > self.scales.x.domain()[0] ? record.start : self.scales.x.domain()[0];
      var end = record.end < self.scales.x.domain()[1] ? record.end : self.scales.x.domain()[1];
      return self.scales.x(end) - self.scales.x(start);
    })
    .attr('fill', function (record) {
      return record.color;
    })
    .on('mouseover', this.mouseover.bind(this))
    .on('mouseout', this.mouseout.bind(this));

  rects.exit().remove();
};

Graph.prototype.mouseover = function (record) {
  return this.tooltip
    .style('display', 'block')
    .style('top',(d3.event.pageY+30) + 'px')
    .style('left',(d3.event.pageX+10) + 'px')
    .html(`
      <div>
        <h3>${record.name}</h4>
        <h6 style="color: ${record.color}">${record.category}</h6>
        <p><strong>Own time:</strong>${utils.formatMs(record.ownTime)}</p>
        <p><strong>Total time:</strong>${utils.formatMs(record.totalTime)}</p>
      </div>
    `);
};
Graph.prototype.mouseout = function (record) {
  return this.tooltip.style('display', 'none');
};

Graph.prototype.update = function (domain) {
  var self = this;
  this.scales.x.domain(domain);
  this.graph.select('.x.axis').call(this.axis.x);

  var visibleItems = this.records.filter(function (record) {
    return record.end > domain[0] || record.start < domain[1];
  });

  this.createRects(visibleItems);
};

module.exports = Graph;
