'use strict';

const async = require('async');
const fs = require('fs-extra');
const glob = require('glob');
const log = require('./logger');
const Mocha = require('mocha');
const minimist = require('minimist');
const oc = require('../src');
const path = require('path');

const mocha = new Mocha({ timeout: 20000 });
const argv = minimist(process.argv.slice(2), { boolean: 'silent' });
const testDirs = [
  'test/unit/**/*.js',
  'test/integration/**/*.js',
  'test/acceptance/**/*.js'
];

if (argv.silent) {
  mocha.reporter('progress');
}

const componentsToPackage = fs
  .readdirSync('./test/fixtures/components')
  .filter(x => x !== 'handlebars3-component');

async.eachSeries(
  componentsToPackage,
  (componentPath, next) =>
    oc.cli.package(
      {
        componentPath: path.join('./test/fixtures/components', componentPath),
        compress: false
      },
      err => next(err)
    ),
  err => {
    if (err) {
      log.error(`Error during test components packaging: ${err}`);
      process.exit(1);
    } else {
      log.complete(`Test components packaged`);
    }

    async.each(
      testDirs,
      (dir, next) => {
        glob(path.join(__dirname, '..', dir), (err, files) => {
          files.forEach(file => mocha.addFile(file));
          next();
        });
      },
      () => {
        mocha.run(err => process.on('exit', () => process.exit(err)));
      }
    );
  }
);
