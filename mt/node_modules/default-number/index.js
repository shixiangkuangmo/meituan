'use strict';

var defaultValue = require('default-val');

function defaultNumber(value, defValue, minValue, maxValue) {
  value = defaultValue(value, defValue, 'number');

  if (typeof minValue === 'number' && !isNaN(minValue)) {
    value = Math.max(minValue, value);
  }

  if (typeof maxValue === 'number' && !isNaN(maxValue)) {
    value = Math.min(maxValue, value);
  }

  return value;
}

module.exports = defaultNumber;
