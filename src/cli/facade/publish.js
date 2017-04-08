'use strict';

var async = require('async');
var colors = require('colors/safe');
var format = require('stringformat');
var path = require('path');
var read = require('read');
var _ = require('underscore');

var strings = require('../../resources/index');
var wrapCliCallback = require('../wrap-cli-callback');

module.exports = function(dependencies){

  var registry = dependencies.registry,
    local = dependencies.local,
    logger = dependencies.logger;

  return function(opts, callback){

    var componentPath = opts.componentPath,
      packageDir = path.resolve(componentPath, '_package'),
      compressedPackagePath = path.resolve(componentPath, 'package.tar.gz'),
      errorMessage;

    callback = wrapCliCallback(callback);

    var getCredentials = function(cb){
      if(opts.username && opts.password){
        logger.ok(strings.messages.cli.USING_CREDS);
        return cb(null, _.pick(opts, 'username', 'password'));
      }

      logger.warn(strings.messages.cli.ENTER_USERNAME);

      read({}, function(err, username){
        logger.warn(strings.messages.cli.ENTER_PASSWORD);

        read({ silent: true }, function(err, password){
          cb(null, { username: username, password: password});
        });
      });
    };

    var packageAndCompress = function(cb){
      logger.warn(format(strings.messages.cli.PACKAGING, packageDir));
      var packageOptions = {
        componentPath: path.resolve(componentPath)
      };
      local.package(packageOptions, function(err, component){
        if(err){ return cb(err); }

        logger.warn(format(strings.messages.cli.COMPRESSING, compressedPackagePath));

        local.compress(packageDir, compressedPackagePath, function(err){
          if(err){ return cb(err); }
          cb(null, component);
        });
      });
    };

    var putComponentToRegistry = function(options, cb){
      logger.warn(format(strings.messages.cli.PUBLISHING, options.route));

      registry.putComponent(options, function(err){

        if(!!err){
          if(err === 'Unauthorized'){
            if(!!options.username || !!options.password){
              logger.err(format(strings.errors.cli.PUBLISHING_FAIL, strings.errors.cli.INVALID_CREDENTIALS));
              return cb(err);
            }

            logger.warn(strings.messages.cli.REGISTRY_CREDENTIALS_REQUIRED);

            return getCredentials(function(err, credentials){
              putComponentToRegistry(_.extend(options, credentials), cb);
            });

          } else if(err.code === 'cli_version_not_valid') {
            var upgradeCommand = format(strings.commands.cli.UPGRADE, err.details.suggestedVersion),
              errorDetails = format(strings.errors.cli.OC_CLI_VERSION_NEEDS_UPGRADE, colors.blue(upgradeCommand));

            errorMessage = format(strings.errors.cli.PUBLISHING_FAIL, errorDetails);
            logger.err(errorMessage);
            return cb(errorMessage);
          } else if(err.code === 'node_version_not_valid') {
            var details = format(strings.errors.cli.NODE_CLI_VERSION_NEEDS_UPGRADE, err.details.suggestedVersion);

            errorMessage = format(strings.errors.cli.PUBLISHING_FAIL, details);
            logger.err(errorMessage);
            return cb(errorMessage);
          } else {
            errorMessage = format(strings.errors.cli.PUBLISHING_FAIL, err);
            logger.err(errorMessage);
            return cb(errorMessage);
          }
        } else {
          logger.ok(format(strings.messages.cli.PUBLISHED, options.route));
          return cb(null, 'ok');
        }
      });
    };

    registry.get(function(err, registryLocations){
      if(err){ 
        logger.err(err);
        return callback(err);
      }

      packageAndCompress(function(err, component){
        if(err){
          errorMessage = format(strings.errors.cli.PACKAGE_CREATION_FAIL, err);
          logger.err(errorMessage);
          return callback(errorMessage);
        }

        async.eachSeries(registryLocations, function(registryUrl, next){
          var registryLength = registryUrl.length,
            registryNormalised = registryUrl.slice(registryLength - 1) === '/' ? registryUrl.slice(0, registryLength - 1) : registryUrl,
            componentRoute = format('{0}/{1}/{2}', registryNormalised, component.name, component.version);

          putComponentToRegistry({ route: componentRoute, path: compressedPackagePath}, next);
        }, function(err){
          local.cleanup(compressedPackagePath, function(err2, res){
            if(err){ return callback(err); }
            callback(err2, res);
          });
        });
      });
    });
  };
};
