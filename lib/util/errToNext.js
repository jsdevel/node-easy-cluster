'use strict';

module.exports = errToNext;

/**
 * Passes errors to next so we don't have to ;)
 * @param {function()} next
 * @param {function()} cb
 */
function errToNext(next, cb){
  return function(){
    var args = [].slice.call(arguments);
    var err = args.shift();
    if(err)return next(err);
    cb.apply(null, args);
  };
}