/*global define*/
define([
  'jquery',
  'underscore',
  'postal',
  'out',
  //no args
  'postaldom'
], function ($, _, postal, out) {
  'use strict';

  var log = out('#output');

  postal.subscribe({
    channel: 'postal-dom-demo',
    topic: 'button.clicked',
    callback: function (data) {
      log.writeln(JSON.stringify(data));
    }
  });

  postal.dom.on('#demo-button', 'click', {
    channel: 'postal-dom-demo',
    topic: 'button.clicked'
  });
});