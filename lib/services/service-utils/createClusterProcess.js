'use strict';

module.exports = createClusterProcess;

var errBack = require('err-back');
var errHandler = require('err-handler');
var fileExists = require('../../util/fsHelpers').fileExists;
var once = require('once');
var fork = require('child_process').fork;
var path = require('path');
var resolve = path.resolve;

function createClusterProcess(args, cb){
  var workerPath = args.workerPath;
  var strategy = path.basename(args.strategy || 'simple');
  var strategyPath = resolve(__dirname, '..', '..', 'strategies', strategy + '.js');
  var startupTime = parseInt(args.startupTime);
  var proc;
  var notifyCb;


  if(!fileExists(args.workerPath))return errBack(
    'File not found: ' + args.workerPath,
    cb
  );

  if(!fileExists(strategyPath))return errBack(
    'unknown strategy ' + strategy,
    cb
  );

  if('startupTime' in args)
    if(!startupTime)return errBack('startupTime not truthy', cb);

  if(!startupTime)startupTime = 1000;

  notifyCb = once(function(err){
    proc.removeAllListeners();
    cb(err, err ? null : proc);
  });

  proc = fork(strategyPath, ['--workerPath', workerPath]);
  proc.once('error', notifyCb);
  proc.once('exit', function(code){
    notifyCb(new Error('code was '+code));
  });
  proc.once('message', function(msg){
    notifyCb(null);
  });
}
