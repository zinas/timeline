'use strict';

var
  Timeline = require('./components/timeline'),
  React = require('react'),
  mountNode = document.getElementById('app');
  global.jQuery = require('../bower_components/jquery/dist/jquery.min');
  require('../bower_components/bootstrap-sass-official/assets/javascripts/bootstrap.min');


React.render(<Timeline></Timeline>, mountNode);