/**
 * postal.dom 0.0.1
 *
 * The MIT License (MIT)
 *
 * Copyright (c) 2013 Nicholas Cloud
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to
 * deal in the Software without restriction, including without limitation the
 * rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
 * sell copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
 * IN THE SOFTWARE.
 */
/*global define*/
define(['jquery', 'underscore', 'postal'], function ($, _, postal) {
  'use strict';

  var NO_OP = function () {},
    ATTR_PREFIX = /^data-postal-([\w]+)$/;

  /**
   * Extracts postal message data from a DOM element
   * @param {Object} e
   * @returns {{}}
   */
  function extractMessageData (e) {
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
  }

  /**
   * DomPub constructor
   * @param {String} selector
   * @param {String} eventName
   * @param {Object} publication
   * @constructor
   */
  function DomPub(selector, eventName, publication) {
    var self = this;

    this.selector = selector;
    this.eventName = eventName;
    this.publication = publication;

    this.el = $(selector);
    this.callback = function (e) {
      var data = extractMessageData(e.target);
      var publication = _.defaults({}, self.publication || {}, {
        data: data
      });
      postal.publish(publication);
    };
    this.el.on(this.eventName, this.callback);
  }

  /**
   * Disposes this DomPub instance and unbinds its DOM callback
   */
  DomPub.prototype.dispose = function () {
    this.el.off(this.eventName, this.callback);
  };

  /**
   * Collection of all DomPub instances
   * @type {Array}
   */
  var domPubs = [];

  var DEFAULT_PUBLICATION = {
    channel: '',
    topic: '#'
  };

  postal.dom = {
    /**
     * Binds a DOM event to a postal message
     * @param {String} selector - DOM selector
     * @param {String} eventName - DOM event
     * @param {Object} [publication] - publication hash with `channel` and `topic` properties
     * @returns {Object}
     */
    on: function (selector, eventName, publication) {
      publication = _.defaults({}, publication, DEFAULT_PUBLICATION);
      var domPub = new DomPub(selector, eventName, publication);
      domPubs.push(domPub);
      return this;
    },

    /**
     * Unbinds a DOM event from a postal message and removes the DOM event handler
     * @param {String} [selector] - DOM selector
     * @param {String} [eventName] - DOM event
     * @param {Object} [publication] - publication hash with `channel` and `topic` properties
     * @returns {Object}
     */
    off: function (selector, eventName, publication) {
      var offArgs = arguments;
      var offPubs = _.filter(domPubs, function (domPub) {
        var meetsCriteria = true;
        // all
        if (offArgs.length === 0) {
          return meetsCriteria;
        }
        // matches selector
        if (offArgs.length >= 1) {
          meetsCriteria = meetsCriteria &&
            domPub.selector === selector;
        }
        // matches selector + event name
        if (offArgs.length  >= 2) {
          meetsCriteria = (meetsCriteria &&
            domPub.eventName === eventName);
        }
        // matches selector + event name + publication channel and topic
        if (offArgs.length >= 3) {
          meetsCriteria = (meetsCriteria &&
            (domPub.publication.channel === publication.channel &&
            domPub.publication.topic === publication.topic));
        }
        return meetsCriteria;
      });
      _.each(offPubs, function (offPub) {
        offPub.dispose();
      });
      return this;
    }
  };

  return postal;
});