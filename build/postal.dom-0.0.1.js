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
});