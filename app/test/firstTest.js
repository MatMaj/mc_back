var assert = require('chai').assert;
const appup = require('../app').appup;
const obj = require('../app').obj;

describe('App', function(){
	it('app should return Up statement', function() {		
		assert.equal(appup(),'App is UP');
	});

	it('Should execute simple function', function() {		
		var result = obj(12, 12);
		assert.equal(result,5425.92);
	});
});
