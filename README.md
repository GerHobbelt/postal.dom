# postal.dom

__postal.dom__ binds a DOM event to a postal channel/topic so that when the DOM event is triggered, a postal message will be published.

Postal message data comes from two sources: `data-postal-*` attributes on the DOM element, and/or a `data` attribute provided on the publication hash passed to `postal.dom.on`.

__postal.dom__ may be used in the browser with require.js. A non-require version will be available soon.

## Prereqs

__postal.dom__ requires:

- jquery
- underscore
- require.js
- postal.js

## Building

To build the project run `jake build`.

Use the `build/postal.dom-X.X.X.js` file in your own project.

## Running the demo

To run the demo project, start the demo server at the project root: `node demo-server.js`.

Then browse to `http://localhost:1982/index.html`.

## Usage

```html
<!-- all data-postal-* attributes will be used as message data -->
<button id="demo-button" data-postal-foo="bar" data-postal-baz="bin">Demo Button</button>
```

```javascript
// subscribe to postal message
postal.subscribe({
  channel: 'postal-dom-demo',
  topic: 'button.clicked',
  callback: function (data) {
    console.log(JSON.stringify(data));
    // { "foo": "bar", "baz": "bin" }
  }
});

// bind DOM event to postal channel/topic
postal.dom.on('#demo-button', 'click', {
  channel: 'postal-dom-demo',
  topic: 'button.clicked'
  //, data: {} /*optional*/
});

// unbind DOM listeners when finished
postal.dom.off('#demo-button');
// or
postal.dom.off('#demo-button', 'click');
// or
postal.dom.on('#demo-button', 'click', {
  channel: 'postal-dom-demo',
  topic: 'button.clicked'
});

// unbind all postal DOM lsiteners
postal.dom.off();
```

## API

TBD

-----

## The MIT License (MIT)

### Copyright (c) 2013 Nicholas Cloud

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
