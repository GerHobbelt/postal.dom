/*global define*/
define(['jquery'], function ($) {
  'use strict';

  function Output(selector) {
    this.el = $(selector);
  }

  Output.prototype.writeln = function (line) {
    var pre = $('<pre></pre>').text(line);
    this.el.append(pre);
    return this;
  };

  return function (selector) {
    return new Output(selector);
  };
});