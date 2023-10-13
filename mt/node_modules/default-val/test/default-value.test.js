'use strict';

var defaultValue = require('..');
var chai = require('chai');
var expect = chai.expect;

/* eslint max-statements: "off", brace-style: "off" */

describe('Arguments', function() {

  describe('When arguments is value and defaultValue', function() {

    it('Should always return defaultValue when value is undefined',
    function(done) {
      expect(defaultValue(undefined, undefined)).to.be.undefined;
      expect(defaultValue(undefined, null)).to.be.null;
      expect(defaultValue(undefined, true)).to.be.true;
      expect(defaultValue(undefined, false)).to.be.false;
      expect(defaultValue(undefined, 0)).to.equal(0);
      expect(defaultValue(undefined, NaN)).to.be.NaN;
      expect(defaultValue(undefined, 123)).to.equal(123);
      expect(defaultValue(undefined, '')).to.equal('');
      expect(defaultValue(undefined, 'ABC')).to.equal('ABC');
      expect(defaultValue(undefined, [])).to.deep.equal([]);
      expect(defaultValue(undefined, {})).to.deep.equal({});
      expect(defaultValue(undefined, { a: 1, b: { c: 2 } })).to.deep
        .equal({ a: 1, b: { c: 2 } });
      expect(defaultValue(undefined, new Date(0))).to.eql(new Date(0));
      done();
    });

    it('Should always return defaultValue when value is null', function(done) {
      expect(defaultValue(null, undefined)).to.be.undefined;
      expect(defaultValue(null, null)).to.be.null;
      expect(defaultValue(null, true)).to.be.true;
      expect(defaultValue(null, false)).to.be.false;
      expect(defaultValue(null, 0)).to.equal(0);
      expect(defaultValue(null, NaN)).to.be.NaN;
      expect(defaultValue(null, 123)).to.equal(123);
      expect(defaultValue(null, '')).to.equal('');
      expect(defaultValue(null, 'ABC')).to.equal('ABC');
      expect(defaultValue(null, [])).to.deep.equal([]);
      expect(defaultValue(null, {})).to.deep.equal({});
      expect(defaultValue(null, { a: 1, b: { c: 2 } })).to.deep
        .equal({ a: 1, b: { c: 2 } });
      expect(defaultValue(null, new Date(0))).to.eql(new Date(0));
      done();
    });

    it('Should always return defaultValue when value is NaN', function(done) {
      expect(defaultValue(NaN, undefined)).to.be.undefined;
      expect(defaultValue(NaN, null)).to.be.null;
      expect(defaultValue(NaN, true)).to.be.true;
      expect(defaultValue(NaN, false)).to.be.false;
      expect(defaultValue(NaN, 0)).to.equal(0);
      expect(defaultValue(NaN, NaN)).to.be.NaN;
      expect(defaultValue(NaN, 123)).to.equal(123);
      expect(defaultValue(NaN, '')).to.equal('');
      expect(defaultValue(NaN, 'ABC')).to.equal('ABC');
      expect(defaultValue(NaN, [])).to.deep.equal([]);
      expect(defaultValue(NaN, {})).to.deep.equal({});
      expect(defaultValue(NaN, { a: 1, b: { c: 2 } })).to.deep
        .equal({ a: 1, b: { c: 2 } });
      expect(defaultValue(NaN, new Date(0))).to.eql(new Date(0));
      done();
    });

    it('Should return defaultValue when object type of value is different ' +
    'from\n\t object type of defaultValue', function(done) {
      expect(defaultValue(123, undefined)).to.be.undefined;
      expect(defaultValue(123, null)).to.be.null;
      expect(defaultValue(123, true)).to.be.true;
      expect(defaultValue(123, false)).to.be.false;
      expect(defaultValue(true, 0)).to.equal(0);
      expect(defaultValue('abc', NaN)).to.be.NaN;
      expect(defaultValue([], 123)).to.equal(123);
      expect(defaultValue(123, '')).to.equal('');
      expect(defaultValue(123, 'ABC')).to.equal('ABC');
      expect(defaultValue(123, [])).to.deep.equal([]);
      expect(defaultValue(123, {})).to.deep.equal({});
      expect(defaultValue(123, { a: 1, b: { c: 2 } })).to.deep
        .equal({ a: 1, b: { c: 2 } });
      expect(defaultValue(123, new Date(0))).to.eql(new Date(0));
      done();
    });

    describe('Should return value when value is valid', function() {

      it('When value is a boolean', function(done) {
        expect(defaultValue(true, true)).to.be.true;
        expect(defaultValue(true, false)).to.be.true;
        expect(defaultValue(false, true)).to.be.false;
        expect(defaultValue(false, false)).to.be.false;
        done();
      });

      it('When value is a number', function(done) {
        expect(defaultValue(0, 0)).to.equal(0);
        expect(defaultValue(123, 0)).to.equal(123);
        expect(defaultValue(0, 123)).to.equal(0);
        expect(defaultValue(0, NaN)).to.equal(0);
        expect(defaultValue(123, NaN)).to.equal(123);
        expect(defaultValue(123, Infinity)).to.equal(123);
        expect(defaultValue(Infinity, NaN)).to.equal(Infinity);
        expect(defaultValue(Infinity, 123)).to.equal(Infinity);
        done();
      });

      it('When value is a string', function(done) {
        expect(defaultValue('', '')).to.equal('');
        expect(defaultValue('', 'xyz')).to.equal('');
        expect(defaultValue('abc', '')).to.equal('abc');
        expect(defaultValue('abc', 'xyz')).to.equal('abc');
        done();
      });

      it('When value is an array', function(done) {
        expect(defaultValue([], [])).to.eql([]);
        expect(defaultValue([], [1,2,3])).to.eql([]);
        expect(defaultValue([1,2,3], [])).to.eql([1,2,3]);
        expect(defaultValue([1,2,3], ['a','b','c'])).to.eql([1,2,3]);
        done();
      });

      it('When value is an object', function(done) {
        expect(defaultValue({}, {})).to.eql({});
        expect(defaultValue({}, { a: 1, b: 2 })).to.eql({});
        expect(defaultValue({ a: 1, b: 2 }, {})).to.eql({ a: 1, b: 2 });
        expect(defaultValue({ a: 1, b: 2 }, { a: 9, b: 8 })).to
          .eql({ a: 1, b: 2 });
        done();
      });

      it('When value is a typed object', function(done) {
        var now = new Date();
        expect(defaultValue(now, new Date(0))).to.eql(now);
        expect(defaultValue(now, new Date())).to.eql(now);
        done();
      });

      it('When value is a function', function(done) {
        var fn1 = function() {};
        var fn2 = function() {};
        expect(defaultValue(fn1, fn2)).to.equal(fn1);
        done();
      });

      it('When value is an error', function(done) {
        var err1 = new TypeError();
        var err2 = new Error();
        expect(defaultValue(err1, err2)).to.equal(err1);
        done();
      });
    });

  });

  describe('When arguments is value, defaultValue and type', function() {

    it('Should always return defaultValue when value is undefined',
    function(done) {
      var type = 'object',
          objType = '[object Undefined]';

      expect(defaultValue(undefined, undefined, type)).to.be.undefined;
      expect(defaultValue(undefined, undefined, objType)).to.be.undefined;

      expect(defaultValue(undefined, null, type)).to.be.null;
      expect(defaultValue(undefined, null, objType)).to.be.null;

      expect(defaultValue(undefined, 123, type)).to.equal(123);
      expect(defaultValue(undefined, 123, objType)).to.equal(123);

      expect(defaultValue(undefined, true, type)).to.be.true;
      expect(defaultValue(undefined, true, objType)).to.be.true;

      expect(defaultValue(undefined, false, type)).to.be.false;
      expect(defaultValue(undefined, false, objType)).to.be.false;

      expect(defaultValue(undefined, 0, type)).to.equal(0);
      expect(defaultValue(undefined, 0, objType)).to.equal(0);

      expect(defaultValue(undefined, NaN, type)).to.be.NaN;
      expect(defaultValue(undefined, NaN, objType)).to.be.NaN;

      expect(defaultValue(undefined, 123, type)).to.equal(123);
      expect(defaultValue(undefined, 123, objType)).to.equal(123);

      expect(defaultValue(undefined, '', type)).to.equal('');
      expect(defaultValue(undefined, '', objType)).to.equal('');

      expect(defaultValue(undefined, 'ABC', type)).to.equal('ABC');
      expect(defaultValue(undefined, 'ABC', objType)).to.equal('ABC');

      expect(defaultValue(undefined, [], type)).to.deep.equal([]);
      expect(defaultValue(undefined, [], objType)).to.deep.equal([]);

      expect(defaultValue(undefined, {}, type)).to.deep.equal({});
      expect(defaultValue(undefined, {}, objType)).to.deep.equal({});

      expect(defaultValue(undefined, { a: 1, b: { c: 2 } }, type)).to.deep
        .equal({ a: 1, b: { c: 2 } });
      expect(defaultValue(undefined, { a: 1, b: { c: 2 } }, objType)).to.deep
        .equal({ a: 1, b: { c: 2 } });

      expect(defaultValue(undefined, new Date(0), type)).to.eql(new Date(0));
      expect(defaultValue(undefined, new Date(0), objType)).to
        .eql(new Date(0));
      done();
    });

    it('Should always return defaultValue when value is null', function(done) {
      var type = 'object',
          objType = '[object Null]';

      expect(defaultValue(null, undefined, type)).to.be.undefined;
      expect(defaultValue(null, undefined, objType)).to.be.undefined;

      expect(defaultValue(null, null, type)).to.be.null;
      expect(defaultValue(null, null, objType)).to.be.null;

      expect(defaultValue(null, 123, type)).to.equal(123);
      expect(defaultValue(null, 123, objType)).to.equal(123);

      expect(defaultValue(null, true, type)).to.be.true;
      expect(defaultValue(null, true, objType)).to.be.true;

      expect(defaultValue(null, false, type)).to.be.false;
      expect(defaultValue(null, false, objType)).to.be.false;

      expect(defaultValue(null, 0, type)).to.equal(0);
      expect(defaultValue(null, 0, objType)).to.equal(0);

      expect(defaultValue(null, NaN, type)).to.be.NaN;
      expect(defaultValue(null, NaN, objType)).to.be.NaN;

      expect(defaultValue(null, 123, type)).to.equal(123);
      expect(defaultValue(null, 123, objType)).to.equal(123);

      expect(defaultValue(null, '', type)).to.equal('');
      expect(defaultValue(null, '', objType)).to.equal('');

      expect(defaultValue(null, 'ABC', type)).to.equal('ABC');
      expect(defaultValue(null, 'ABC', objType)).to.equal('ABC');

      expect(defaultValue(null, [], type)).to.deep.equal([]);
      expect(defaultValue(null, [], objType)).to.deep.equal([]);

      expect(defaultValue(null, {}, type)).to.deep.equal({});
      expect(defaultValue(null, {}, objType)).to.deep.equal({});

      expect(defaultValue(null, { a: 1, b: { c: 2 } }, type)).to.deep
        .equal({ a: 1, b: { c: 2 } });
      expect(defaultValue(null, { a: 1, b: { c: 2 } }, objType)).to.deep
        .equal({ a: 1, b: { c: 2 } });

      expect(defaultValue(null, new Date(0), type)).to.eql(new Date(0));
      expect(defaultValue(null, new Date(0), objType)).to.eql(new Date(0));
      done();
    });

    it('Should always return defaultValue when value is NaN', function(done) {
      var type = 'object',
          objType = '[object NaN]';

      expect(defaultValue(NaN, undefined, type)).to.be.undefined;
      expect(defaultValue(NaN, undefined, objType)).to.be.undefined;

      expect(defaultValue(NaN, null, type)).to.be.null;
      expect(defaultValue(NaN, null, objType)).to.be.null;

      expect(defaultValue(NaN, 123, type)).to.equal(123);
      expect(defaultValue(NaN, 123, objType)).to.equal(123);

      expect(defaultValue(NaN, true, type)).to.be.true;
      expect(defaultValue(NaN, true, objType)).to.be.true;

      expect(defaultValue(NaN, false, type)).to.be.false;
      expect(defaultValue(NaN, false, objType)).to.be.false;

      expect(defaultValue(NaN, 0, type)).to.equal(0);
      expect(defaultValue(NaN, 0, objType)).to.equal(0);

      expect(defaultValue(NaN, NaN, type)).to.be.NaN;
      expect(defaultValue(NaN, NaN, objType)).to.be.NaN;

      expect(defaultValue(NaN, 123, type)).to.equal(123);
      expect(defaultValue(NaN, 123, objType)).to.equal(123);

      expect(defaultValue(NaN, '', type)).to.equal('');
      expect(defaultValue(NaN, '', objType)).to.equal('');

      expect(defaultValue(NaN, 'ABC', type)).to.equal('ABC');
      expect(defaultValue(NaN, 'ABC', objType)).to.equal('ABC');

      expect(defaultValue(NaN, [], type)).to.deep.equal([]);
      expect(defaultValue(NaN, [], objType)).to.deep.equal([]);

      expect(defaultValue(NaN, {}, type)).to.deep.equal({});
      expect(defaultValue(NaN, {}, objType)).to.deep.equal({});

      expect(defaultValue(NaN, { a: 1, b: { c: 2 } }, type)).to.deep
        .equal({ a: 1, b: { c: 2 } });
      expect(defaultValue(NaN, { a: 1, b: { c: 2 } }, objType)).to.deep
        .equal({ a: 1, b: { c: 2 } });

      expect(defaultValue(NaN, new Date(0), type)).to.eql(new Date(0));
      expect(defaultValue(NaN, new Date(0), objType)).to.eql(new Date(0));
      done();
    });

    it('Should return defaultValue when type is unmatched', function(done) {
      expect(defaultValue(true, null, 'number')).to.be.null;
      expect(defaultValue(true, false, 'number')).to.be.false;
      expect(defaultValue(false, null, 'number')).to.be.null;
      expect(defaultValue(false, true, 'number')).to.be.true;

      expect(defaultValue(0, null, 'string')).to.be.null;
      expect(defaultValue(0, 123, 'string')).to.equal(123);
      expect(defaultValue(123, null, 'string')).to.be.null;
      expect(defaultValue(123, 0, 'string')).to.equal(0);

      expect(defaultValue('', null, 'object')).to.be.null;
      expect(defaultValue('', 'ABC', 'object')).to.equal('ABC');
      expect(defaultValue('ABC', null, 'object')).to.be.null;
      expect(defaultValue('ABC', '', 'object')).to.equal('');

      expect(defaultValue({}, null, '[object Date]')).to.be.null;
      expect(defaultValue({}, 'ABC', '[object Date]')).to.equal('ABC');
      expect(defaultValue({ a:1, b:2 }, null, '[object Date]')).to.be.null;
      expect(defaultValue({ a:1, b:2 }, {}, 'object Date]')).to.eql({});
      done();
    });

    describe('Should return defaultValue when type is matched', function() {

      it('When value is a boolean', function(done) {
        expect(defaultValue(true, null, 'boolean')).to.be.true;
        expect(defaultValue(true, false, 'boolean')).to.be.true;
        expect(defaultValue(true, 0, 'boolean')).to.be.true;
        expect(defaultValue(false, null, 'boolean')).to.be.false;
        expect(defaultValue(false, true, 'boolean')).to.be.false;
        expect(defaultValue(false, 0, 'boolean')).to.be.false;

        expect(defaultValue(true, null, '[object Boolean]')).to.be.true;
        expect(defaultValue(true, false, '[object Boolean]')).to.be.true;
        expect(defaultValue(true, 0, '[object Boolean]')).to.be.true;
        expect(defaultValue(false, null, '[object Boolean]')).to.be.false;
        expect(defaultValue(false, true, '[object Boolean]')).to.be.false;
        expect(defaultValue(false, 0, '[object Boolean]')).to.be.false;
        done();
      });

      it('When value is a number', function(done) {
        expect(defaultValue(0, null, 'number')).to.equal(0);
        expect(defaultValue(0, 123, 'number')).to.equal(0);
        expect(defaultValue(0, '', 'number')).to.equal(0);
        expect(defaultValue(123, null, 'number')).to.equal(123);
        expect(defaultValue(123, 0, 'number')).to.equal(123);
        expect(defaultValue(123, '', 'number')).to.equal(123);

        expect(defaultValue(0, null, '[object Number]')).to.equal(0);
        expect(defaultValue(0, 123, '[object Number]')).to.equal(0);
        expect(defaultValue(0, '', '[object Number]')).to.equal(0);
        expect(defaultValue(123, null, '[object Number]')).to.equal(123);
        expect(defaultValue(123, 0, '[object Number]')).to.equal(123);
        expect(defaultValue(123, '', '[object Number]')).to.equal(123);
        done();
      });

      it('When value is a string', function(done) {
        expect(defaultValue('', null, 'string')).to.equal('');
        expect(defaultValue('', 'ABC', 'string')).to.equal('');
        expect(defaultValue('', 0, 'string')).to.equal('');
        expect(defaultValue('ABC', null, 'string')).to.equal('ABC');
        expect(defaultValue('ABC', '', 'string')).to.equal('ABC');
        expect(defaultValue('ABC', 0, 'string')).to.equal('ABC');

        expect(defaultValue('', null, '[object String]')).to.equal('');
        expect(defaultValue('', 'ABC', '[object String]')).to.equal('');
        expect(defaultValue('', 0, '[object String]')).to.equal('');
        expect(defaultValue('ABC', null, '[object String]')).to.equal('ABC');
        expect(defaultValue('ABC', '', '[object String]')).to.equal('ABC');
        expect(defaultValue('ABC', 0, '[object String]')).to.equal('ABC');
        done();
      });

      it('When value is an array', function(done) {
        expect(defaultValue([], null, 'object')).to.eql([]);
        expect(defaultValue([], [1,2,3], 'object')).to.eql([]);
        expect(defaultValue([], '', 'object')).to.eql([]);

        expect(defaultValue([1,2,3], null, 'object')).to.eql([1,2,3]);
        expect(defaultValue([1,2,3], [], 'object')).to.eql([1,2,3]);
        expect(defaultValue([1,2,3], '', 'object')).to.eql([1,2,3]);

        expect(defaultValue([], null, '[object Array]')).to.eql([]);
        expect(defaultValue([], [1,2,3], '[object Array]')).to.eql([]);
        expect(defaultValue([], '', '[object Array]')).to.eql([]);

        expect(defaultValue([1,2,3], null, '[object Array]')).to.eql([1,2,3]);
        expect(defaultValue([1,2,3], [], '[object Array]')).to.eql([1,2,3]);
        expect(defaultValue([1,2,3], '', '[object Array]')).to.eql([1,2,3]);
        done();
      });

      it('When value is an object', function(done) {
        expect(defaultValue({}, null, 'object')).to.eql({});
        expect(defaultValue({}, { a:1, b:2 }, 'object')).to.eql({});
        expect(defaultValue({}, '', 'object')).to.eql({});

        expect(defaultValue({ a:1, b:2 }, null, 'object')).to
          .eql({ a:1, b:2 });
        expect(defaultValue({ a:1, b:2 }, {}, 'object')).to
          .eql({ a:1, b:2 });
        expect(defaultValue({ a:1, b:2 }, '', 'object')).to
          .eql({ a:1, b:2 });

        expect(defaultValue({}, null, '[object Object]')).to.eql({});
        expect(defaultValue({}, { a:1, b:2 }, '[object Object]')).to.eql({});
        expect(defaultValue({}, '', '[object Object]')).to.eql({});

        expect(defaultValue({ a:1, b:2 }, null, '[object Object]')).to
          .eql({ a:1, b:2 });
        expect(defaultValue({ a:1, b:2 }, {}, '[object Object]')).to
          .eql({ a:1, b:2 });
        expect(defaultValue({ a:1, b:2 }, '', '[object Object]')).to
          .eql({ a:1, b:2 });
        done();
      });

      it('When value is a typed object', function(done) {
        var now = new Date();
        expect(defaultValue(now, null, 'object')).to.equal(now);
        expect(defaultValue(now, new Date(0), 'object')).to.equal(now);
        expect(defaultValue(now, {}, 'object')).to.equal(now);
        expect(defaultValue(now, '', 'object')).to.equal(now);

        expect(defaultValue(now, null, '[object Date]')).to.equal(now);
        expect(defaultValue(now, new Date(0), '[object Date]')).to.equal(now);
        expect(defaultValue(now, {}, '[object Date]')).to.equal(now);
        expect(defaultValue(now, '', '[object Date]')).to.equal(now);
        done();
      });

      it('WHen value is a function', function(done) {
        var fn1 = function() {};
        var fn2 = function() {};
        expect(defaultValue(fn1, null, 'function')).to.equal(fn1);
        expect(defaultValue(fn1, fn2, 'function')).to.equal(fn1);
        expect(defaultValue(fn1, {}, 'function')).to.equal(fn1);

        expect(defaultValue(fn1, null, '[object Function]')).to.equal(fn1);
        expect(defaultValue(fn1, fn2, '[object Function]')).to.equal(fn1);
        expect(defaultValue(fn1, {}, '[object Function]')).to.equal(fn1);
        done();
      });

      it('WHen value is an error', function(done) {
        var err1 = new TypeError();
        var err2 = new Error();
        expect(defaultValue(err1, null, 'object')).to.equal(err1);
        expect(defaultValue(err1, err2, 'object')).to.equal(err1);
        expect(defaultValue(err1, {}, 'object')).to.equal(err1);
        expect(defaultValue(err1, 123, 'object')).to.equal(err1);

        expect(defaultValue(err1, null, '[object Error]')).to.equal(err1);
        expect(defaultValue(err1, err2, '[object Error]')).to.equal(err1);
        expect(defaultValue(err1, {}, '[object Error]')).to.equal(err1);
        expect(defaultValue(err1, 123, '[object Error]')).to.equal(err1);
        done();
      });
    });
  });

});
