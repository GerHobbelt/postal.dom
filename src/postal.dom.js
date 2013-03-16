/*global define*/
define(['jquery', 'underscore', 'postal'], function ($, _, postal) {
  'use strict';

  var NO_OP = function () {},
    ATTR_PREFIX = /^data-postal-([\w]+)$/;

  function DomPub(selector, event, publication) {
    var self = this;

    this.selector = selector;
    this.event = event;
    this.publication = publication;

    this.el = $(selector);
    this.callback = function (e) {
      var data = self.extractMessageData(e.target);
      var publication = _.defaults({}, self.publication || {}, {
        data: data
      });
      postal.publish(publication);
    };
    this.el.on(this.event, this.callback);
  }

  DomPub.prototype.dispose = function () {
    this.el.off(this.event, this.callback);
  };

  DomPub.prototype.extractMessageData = function (e) {
    var data = {};
    _.each(e.attributes, function (a) {
      var match = ATTR_PREFIX.exec(a.name);
      if (!match || match.length < 2) {
        return;
      }
      var propName = match[1];
      data[propName] = a.value;
    });
    return data;
  };

  var domPubs = [];

  postal.dom = {
    on: function (selector, event, publication) {
      var domPub = new DomPub(selector, event, publication);
      domPubs.push(domPub);
      return this;
    },
    off: function (selector, event) {

      return this;
    },
    clear: function (onClear) {
      onClear = onClear || NO_OP;
      setTimeout(function () {
        _.each(domPubs, function (domPub) {
          domPub.dispose();
        });
        onClear();
      }, 0);
      return this;
    }
  };

  return postal;
});