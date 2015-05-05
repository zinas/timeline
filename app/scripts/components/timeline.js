'use strict';

var
  React = require('react'),
  d3 = require('../../bower_components/d3/d3'),
  Frames = require('../data/frames'),
  FramesGraph = require('../graphs/frames'),
  RecordsGraph = require('../graphs/records');

/**
 * Components for rendering the full timeline
 */
var Timeline = React.createClass({
  componentDidMount: function () {
    Frames.get().then((function (data) {
      console.log(data);
      var
        w = document.getElementById('timeline').offsetWidth,
        h = 150,
        framesGraph, timelineGraph, recordsGraph, brush, fps60, fps30;

      timelineGraph = d3.select('#timeline');

      framesGraph = new FramesGraph(data, {width: w, height: h});
      recordsGraph = new RecordsGraph(data, {width: w, height: h});

      framesGraph.appendTo(timelineGraph);
      recordsGraph.appendTo(timelineGraph);

      fps30 = h - framesGraph.scales.y(2*16.66);
      fps60 = h - framesGraph.scales.y(16.66);

      timelineGraph
        .append('line')
        .attr('x1', 0)
        .attr('x2', w)
        .attr('y1', fps60)
        .attr('y2', fps60)
        .attr('stroke-width', 1)
        .attr('stroke', '#999');

      timelineGraph
        .append('line')
        .attr('x1', 0)
        .attr('x2', w)
        .attr('y1', fps30)
        .attr('y2', fps30)
        .attr('stroke-width', 1)
        .attr('stroke', '#999');

      brush = d3.svg.brush()
        .x(framesGraph.scales.x)
        .on('brush', function () {
          var domain = brush.empty() ? framesGraph.scales.x.domain() : brush.extent();
          recordsGraph.update(domain);
        });

      timelineGraph
        .append('g')
        .attr('class', 'x brush')
        .call(brush).selectAll('rect')
        .attr('y', 0)
        .attr('height', h);

    }).bind(this));
  },
  render: function() {
    return (
      <svg width='100%' id='timeline'></svg>
    );
  }
});

module.exports = Timeline;