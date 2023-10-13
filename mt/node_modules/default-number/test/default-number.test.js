'use strict';

var defaultNumber = require('..');
var chai = require('chai');
var expect = chai.expect;

/* eslint max-statements: "off", brace-style: "off" */

describe('defaultNumber', function() {

  describe('When arguments is value and defValue', function() {

    it('Should return defValue when value is non-number', function() {
      expect(defaultNumber(undefined, 123)).to.equal(123);
      expect(defaultNumber(null, 123)).to.equal(123);
      expect(defaultNumber(true, 123)).to.equal(123);
      expect(defaultNumber(false, 123)).to.equal(123);
      expect(defaultNumber('', 123)).to.equal(123);
      expect(defaultNumber('ABC', 123)).to.equal(123);
      expect(defaultNumber([], 123)).to.equal(123);
      expect(defaultNumber({ a: 1, b: { c: 2 } }, 123)).to.equal(123);
      expect(defaultNumber(new Date(0), 123)).to.equal(123);
    })

    it('Should return defValue when value is NaN', function() {
      expect(defaultNumber(NaN, 123)).to.equal(123);
    })

    it('Should return value when value is valid', function() {
      expect(defaultNumber(100, 123)).to.equal(100);
      expect(defaultNumber(0, 123)).to.equal(0);
      expect(defaultNumber(-10, 123)).to.equal(-10);
    })
  });

  describe('When arguments is value, defValue and minValue', function() {

    it('Should return minValue when value/defValue is less than minValue',
    function() {
      expect(defaultNumber(122, 0, 123)).to.equal(123);
      expect(defaultNumber(0, 0, 1)).to.equal(1);
      expect(defaultNumber(-3, 0, -2)).to.equal(-2);

      expect(defaultNumber(null, 122, 123)).to.equal(123);
      expect(defaultNumber(null, 0, 1)).to.equal(1);
      expect(defaultNumber(null, -3, -2)).to.equal(-2);
    })

    it('Should return value/defValue when value/defValue is greater than ' +
    '\n\tminValue', function() {
      expect(defaultNumber(124, 0, 123)).to.equal(124);
      expect(defaultNumber(2, 0, 1)).to.equal(2);
      expect(defaultNumber(-1, 0, -2)).to.equal(-1);

      expect(defaultNumber(null, 124, 123)).to.equal(124);
      expect(defaultNumber(null, 2, 1)).to.equal(2);
      expect(defaultNumber(null, -1, -2)).to.equal(-1);
    })

    it('Should ignore minValue when minValue is non-number', function() {
      expect(defaultNumber(122, 0, null)).to.equal(122);
      expect(defaultNumber(0, 0, null)).to.equal(0);
      expect(defaultNumber(-3, 0, null)).to.equal(-3);

      expect(defaultNumber(null, 122, null)).to.equal(122);
      expect(defaultNumber(null, 0, null)).to.equal(0);
      expect(defaultNumber(null, -3, null)).to.equal(-3);

      expect(defaultNumber(122, 0, '123')).to.equal(122);
      expect(defaultNumber(0, 0, '1')).to.equal(0);
      expect(defaultNumber(-3, 0, '-2')).to.equal(-3);

      expect(defaultNumber(null, 122, '123')).to.equal(122);
      expect(defaultNumber(null, 0, '1')).to.equal(0);
      expect(defaultNumber(null, -3, '-2')).to.equal(-3);
    })

    it('Should ignore minValue when minValue is NaN', function() {
      expect(defaultNumber(122, 0, NaN)).to.equal(122);
      expect(defaultNumber(0, 0, NaN)).to.equal(0);
      expect(defaultNumber(-3, 0, NaN)).to.equal(-3);

      expect(defaultNumber(null, 122, NaN)).to.equal(122);
      expect(defaultNumber(null, 0, NaN)).to.equal(0);
      expect(defaultNumber(null, -3, NaN)).to.equal(-3);
    })
  });

  describe('When arguments is value, defValue, minValue and maxValue',
  function() {

    it('Should return minValue when value/defValue is greater than maxValue',
    function() {
      expect(defaultNumber(122, 0, 123, 125)).to.equal(123);
      expect(defaultNumber(0, 0, 1, 3)).to.equal(1);
      expect(defaultNumber(-3, 0, -2, 1)).to.equal(-2);

      expect(defaultNumber(null, 122, 123, 125)).to.equal(123);
      expect(defaultNumber(null, 0, 1, 3)).to.equal(1);
      expect(defaultNumber(null, -3, -2, 1)).to.equal(-2);
    })

    it('Should return maxValue when value/defValue is less than maxValue',
    function() {
      expect(defaultNumber(126, 0, 123, 125)).to.equal(125);
      expect(defaultNumber(4, 0, 1, 3)).to.equal(3);
      expect(defaultNumber(2, 0, -2, 1)).to.equal(1);

      expect(defaultNumber(null, 126, 123, 125)).to.equal(125);
      expect(defaultNumber(null, 4, 1, 3)).to.equal(3);
      expect(defaultNumber(null, 2, -2, 1)).to.equal(1);
    })

    it('Should return value/defValue when value/defValue is in range',
    function() {
      expect(defaultNumber(124, 0, 123, 125)).to.equal(124);
      expect(defaultNumber(2, 0, 1, 3)).to.equal(2);
      expect(defaultNumber(-1, 0, -2, 1)).to.equal(-1);

      expect(defaultNumber(null, 124, 123, 125)).to.equal(124);
      expect(defaultNumber(null, 2, 1, 3)).to.equal(2);
      expect(defaultNumber(null, -1, -2, 1)).to.equal(-1);
    })

    it('Should ignore minValue when minValue is non-number', function() {
      expect(defaultNumber(124, 0, '126', 125)).to.equal(124);
      expect(defaultNumber(2, 0, '1', 3)).to.equal(2);
      expect(defaultNumber(-1, 0, '-2', 1)).to.equal(-1);

      expect(defaultNumber(null, 124, '123', 125)).to.equal(124);
      expect(defaultNumber(null, 2, '1', 3)).to.equal(2);
      expect(defaultNumber(null, -1, '-2', 1)).to.equal(-1);
    })

    it('Should ignore minValue when minValue is NaN', function() {
      expect(defaultNumber(124, 0, NaN, 125)).to.equal(124);
      expect(defaultNumber(2, 0, NaN, 3)).to.equal(2);
      expect(defaultNumber(-1, 0, NaN, 1)).to.equal(-1);

      expect(defaultNumber(null, 124, NaN, 125)).to.equal(124);
      expect(defaultNumber(null, 2, NaN, 3)).to.equal(2);
      expect(defaultNumber(null, -1, NaN, 1)).to.equal(-1);
    })

    it('Should ignore maxValue when maxValue is non-number', function() {
      expect(defaultNumber(124, 0, 123, '125')).to.equal(124);
      expect(defaultNumber(2, 0, 1, '3')).to.equal(2);
      expect(defaultNumber(-1, 0, -2, '1')).to.equal(-1);

      expect(defaultNumber(null, 124, 123, '125')).to.equal(124);
      expect(defaultNumber(null, 2, 1, '3')).to.equal(2);
      expect(defaultNumber(null, -1, -2, '1')).to.equal(-1);
    })

    it('Should ignore maxValue when maxValue is NaN', function() {
      expect(defaultNumber(124, 0, 123, NaN)).to.equal(124);
      expect(defaultNumber(2, 0, 1, NaN)).to.equal(2);
      expect(defaultNumber(-1, 0, -2, NaN)).to.equal(-1);

      expect(defaultNumber(null, 124, 123, NaN)).to.equal(124);
      expect(defaultNumber(null, 2, 1, NaN)).to.equal(2);
      expect(defaultNumber(null, -1, -2, NaN)).to.equal(-1);
    })
  });

});

