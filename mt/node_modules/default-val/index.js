'use strict';

function defaultValue(value, defValue, type) {
  if (value == null) {
    return defValue;
  }

  if (typeof value === 'number' && isNaN(value)) {
    return defValue;
  }

  if (typeof type !== 'string') {
    type = objectType(defValue);
  }

  if (objectType(value) === type || typeof value === type) {
    return value;
  }

  return defValue;
}

function objectType(value) {
  return Object.prototype.toString.call(value);
}

module.exports = defaultValue;
