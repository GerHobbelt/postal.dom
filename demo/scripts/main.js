/*global requirejs, require, console*/
requirejs.config({
  paths: {
    'jquery': 'jquery-1.9.1',
    'underscore': 'underscore-1.4.4',
    'postaldom': 'postal.dom'
  },
  shim: {
    'underscore': {
      exports: '_'
    }
  }
});

require(['app'], function () {
  console.log('app ready');
});