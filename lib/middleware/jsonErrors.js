'use strict';

module.exports = function(err, req, res, next){
  if(!(err instanceof Error))err = new Error(err);
  res.json(500, {
    message: err.message
  });
};
