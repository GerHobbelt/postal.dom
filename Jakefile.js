/*global jake, desc, task, directory, file, complete, namespace*/
'use strict';
var pkg = require('./package.json'),
  path = require('path'),
  fs = require('fs'),
  os = require('os'),
  exec = require('child_process').exec,
  async = require('async'),
  rimraf = require('rimraf');

var ROOT_DIR = __dirname,
  SRC_DIR = path.join(ROOT_DIR, 'src'),
  BUILD_DIR = path.join(ROOT_DIR, 'build'),
  BUILD_FILE = 'postal.dom-' + pkg.version + '.js',
  TEST_DIR = path.join(ROOT_DIR, 'test'),
  DEMO_DIR = path.join(ROOT_DIR, 'demo');

var VERSION_TEMPLATE_VAR = '{{VERSION}}';

function concatFiles(files, outputFile, callback) {
  var readHandlers = files.map(function (file) {
    return function (callback) {
      fs.readFile(file, function (err, contentBuffer) {
        callback(err, contentBuffer);
      });
    };
  });

  async.parallel(readHandlers, function (err, files) {
    if (err) {
      return callback(err);
    }
    var output = files.join(os.EOL)
      .replace(VERSION_TEMPLATE_VAR, pkg.version);
    fs.writeFile(outputFile, output, callback);
  });
}

namespace('package', function () {
  // gets the project version from package.json
  task('version', function () {
    return pkg.version;
  });
});

// creates the build directory
directory(BUILD_DIR);

desc('cleans previous builds');
task('clean', function () {
  rimraf(BUILD_DIR, function (err) {
    complete();
  });
}, {async: true});

desc('builds project');
task('build', ['clean', BUILD_DIR], function () {
  console.log('@@ ROOT_DIR', ROOT_DIR);
  console.log('@@ BUILD_DIR', BUILD_DIR);

  var inputFiles = [
    path.join(ROOT_DIR, 'license.js'),
    path.join(SRC_DIR, 'postal.dom.js')
  ];

  var buildFile = path.join(BUILD_DIR, BUILD_FILE);
  concatFiles(inputFiles, buildFile, function (err) {
    if (err) {
      return console.error(err);
    }
    console.log('Build complete.');
    console.log('Build output:', buildFile);

    jake.Task['demo:build'].invoke();
  });
});

namespace('demo', function () {
  // removes old build output in the demo/scripts directory
  task('clean', function () {
    var cmd = 'rm ' + path.join(DEMO_DIR, 'scripts') + '/postal.dom.js';
    console.log('@@ ' + cmd);
    exec(cmd, function (err, stdout, stderr) {
      if (err) {
        return console.error(err);
      }
    });
  });

  // copies the build output to the demo/scripts directory
  task('build', ['demo:clean'], function () {
    var demoFile = path.join(DEMO_DIR, 'scripts', 'postal.dom.js');
    var cmd = 'cp ' + path.join(BUILD_DIR, BUILD_FILE) + ' ' + demoFile;
    console.log('@@ ' + cmd);
    exec(cmd, function (err, stdout, stderr) {
      if (err) {
        return console.error(err);
      }
      console.log('Demo build complete.');
      console.log('Demo build output:', demoFile);
    });
  });
});

desc('runs unit tests');
task('test', function () {
  console.log('@@ TEST_DIR', TEST_DIR);

  var mochaBin = path.join(ROOT_DIR, 'node_modules', '.bin', 'mocha');
  var testCmd = mochaBin + ' ' + TEST_DIR;
  jake.exec(testCmd, function () {
  }, {printStdout: true});
});

task('default', function () {
  console.log('postal.dom -- DOM/postal.js event bridge');
  console.log('To see available tasks:');
  console.log('$ jake --tasks');
});

