'use strict';

/*
 * Demo HTTP server.
 * To run: `node demo-server.js`
 * Then browse: http://localhost:1982/index.html
 */
var strata = require('strata'),
  path = require('path');

strata.use(strata.commonLogger);
strata.use(strata.contentType);
strata.use(strata.contentLength);
strata.use(strata.file, path.join(__dirname, 'demo'));
strata.run();