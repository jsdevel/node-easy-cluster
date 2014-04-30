'use strict';

describe('fsHelpers', function(){
  var module = require('../../../lib/utils/fsHelpers');

  it('has a fileExists method', function() {
    module.fileExists(__filename).should.be.true;
  });
});
