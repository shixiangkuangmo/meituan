(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.ClassConfig = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict'

const Config = require('./lib/config')
const Manager = require('./lib/manager')

Object.defineProperty(Config, 'Manager', {
  enumerable: true,
  value: Manager,
})

module.exports = Config

},{"./lib/config":2,"./lib/manager":3}],2:[function(require,module,exports){
'use strict'

const copyProps = require('copy-props')
const defaultValue = require('default-val')
const stringer = require('instance-stringer')

class ClassConfig {

  constructor (initConfig, defaultConfig, { sharePrivate } = {}) {
    if (sharePrivate && (initConfig instanceof ClassConfig)) {
      Object.defineProperty(this, '$private', {
        value: initConfig.$private
      })
    } else {
      Object.defineProperty(this, '$private', { value: {} })
      copyProps(defaultConfig, this.$private)
      copyProps(initConfig, this.$private, initPrivateProp)

      this.defineMorePrivates(this.$private)
    }

    const accessors = this.defineAccessors(this.$private, this)

    copyProps(this.$private, this, (src, dst) => {
      const descriptor = toAccessorDescriptor(src, dst, accessors)
      Object.defineProperty(dst.parent, dst.key, descriptor)
    })
  }

  configure (instance, interfaces = {}) {
    defineToString(instance)
    let descriptors = this.defineInterfaces(this, instance)
    descriptors = toInterfaceDescriptors(descriptors, interfaces, instance)
    Object.defineProperties(instance, descriptors)
  }

  toString () { return stringer(this) }

  defineMorePrivates (/* $private */) {}

  defineAccessors (/* $private, config */) {}

  defineInterfaces (/* config, instance */) {}

  static readonly ({ get, enumerable = true }) {
    return {
      enumerable,
      set () {},
      get,
    }
  }

  static writable ({ get, set, enumerable = true, configurable = false }) {
    return {
      enumerable,
      configurable,
      set,
      get,
    }
  }

  static replaceable ({ get, enumerable = true }) {
    return {
      enumerable,
      configurable: true,
      get,
      set: toReplaceable,
    }
  }

  static method (fn) {
    return {
      enumerable: true,
      configurable: true,
      writable: true,
      value: fn,
    }
  }
}

function initPrivateProp (src, dst) {
  return defaultValue(src.value, dst.value)
}

function defineToString (instance) {
  Object.defineProperties(instance, {
    [Symbol.toStringTag]: {
      get () { return instance.constructor.name },
      /* istanbul ignore next */
      set () {},
    }
  })
}

function toAccessorDescriptor (src, dst, accessors = {}) {
  let descriptor = accessors[dst.keyChain]

  if (!descriptor) {
    descriptor = {
      enumerable: true,
      get () { return src.parent[src.key] },
      set (v) { src.parent[src.key] = defaultValue(v, src.parent[src.key]) },
    }
  }

  if (descriptor.set === toReplaceable) {
    toReplaceable(descriptor, dst.parent, dst.key)
  }

  return descriptor
}

function toInterfaceDescriptors (byConfig, byInstance, instance) {
  const descriptors = Object.assign({}, byConfig, byInstance)

  Object.keys(descriptors).forEach(key => {
    const descriptor = descriptors[key]
    if (descriptor.set === toReplaceable) {
      toReplaceable(descriptor, instance, key)
    }
  })

  return descriptors
}

function toReplaceable (descriptor, obj, name) {
  descriptor.set = value => {
    Object.defineProperty(obj, name, {
      enumerable: descriptor.enumerable,
      configurable: true,
      writable: true,
      value,
    })
  }
}

module.exports = ClassConfig

},{"copy-props":6,"default-val":7,"instance-stringer":11}],3:[function(require,module,exports){
'use strict'

const ClassConfig = require('./config')

class ClassConfigManager {

  constructor () {
    this._objectConfigMap = new WeakMap()
  }

  set (object, config) {
    if (config instanceof ClassConfig ||
        object instanceof ClassConfig) {
      this._objectConfigMap.set(config, object)
      this._objectConfigMap.set(object, config)
    }
  }

  delete (objectOrConfig) {
    const configOrObject = this._objectConfigMap.get(objectOrConfig)
    this._objectConfigMap.delete(objectOrConfig)
    this._objectConfigMap.delete(configOrObject)
  }

  getConfig (object) {
    const config = this._objectConfigMap.get(object)
    if (config instanceof ClassConfig) {
      return config
    }
  }

  getObject (config) {
    if (config instanceof ClassConfig) {
      return this._objectConfigMap.get(config)
    }
  }
}

module.exports = ClassConfigManager

},{"./config":2}],4:[function(require,module,exports){
/*!
 * array-each <https://github.com/jonschlinkert/array-each>
 *
 * Copyright (c) 2015, 2017, Jon Schlinkert.
 * Released under the MIT License.
 */

'use strict';

/**
 * Loop over each item in an array and call the given function on every element.
 *
 * ```js
 * each(['a', 'b', 'c'], function(ele) {
 *   return ele + ele;
 * });
 * //=> ['aa', 'bb', 'cc']
 *
 * each(['a', 'b', 'c'], function(ele, i) {
 *   return i + ele;
 * });
 * //=> ['0a', '1b', '2c']
 * ```
 *
 * @name each
 * @alias forEach
 * @param {Array} `array`
 * @param {Function} `fn`
 * @param {Object} `thisArg` (optional) pass a `thisArg` to be used as the context in which to call the function.
 * @return {undefined}
 * @api public
 */

module.exports = function each(arr, cb, thisArg) {
  if (arr == null) return;

  var len = arr.length;
  var idx = -1;

  while (++idx < len) {
    var ele = arr[idx];
    if (cb.call(thisArg, ele, idx, arr) === false) {
      break;
    }
  }
};

},{}],5:[function(require,module,exports){
/*!
 * array-slice <https://github.com/jonschlinkert/array-slice>
 *
 * Copyright (c) 2014-2017, Jon Schlinkert.
 * Released under the MIT License.
 */

'use strict';

module.exports = function slice(arr, start, end) {
  var len = arr.length;
  var range = [];

  start = idx(len, start);
  end = idx(len, end, len);

  while (start < end) {
    range.push(arr[start++]);
  }
  return range;
};

function idx(len, pos, end) {
  if (pos == null) {
    pos = end || 0;
  } else if (pos < 0) {
    pos = Math.max(len + pos, 0);
  } else {
    pos = Math.min(pos, len);
  }

  return pos;
}

},{}],6:[function(require,module,exports){
'use strict';

var eachProps = require('each-props');
var isPlainObject = require('is-plain-object');

module.exports = function(src, dst, fromto, converter, reverse) {

  if (!isObject(src)) {
    src = {};
  }

  if (!isObject(dst)) {
    dst = {};
  }

  if (isPlainObject(fromto)) {
    fromto = onlyValueIsString(fromto);
  } else if (Array.isArray(fromto)) {
    fromto = arrayToObject(fromto);
  } else if (typeof fromto === 'boolean') {
    reverse = fromto;
    converter = noop;
    fromto = null;
  } else if (typeof fromto === 'function') {
    reverse = converter;
    converter = fromto;
    fromto = null;
  } else {
    fromto = null;
  }

  if (typeof converter !== 'function') {
    if (typeof converter === 'boolean') {
      reverse = converter;
      converter = noop;
    } else {
      converter = noop;
    }
  }

  if (typeof reverse !== 'boolean') {
    reverse = false;
  }

  if (reverse) {
    var tmp = src;
    src = dst;
    dst = tmp;

    if (fromto) {
      fromto = invert(fromto);
    }
  }

  var opts = {
    dest: dst,
    fromto: fromto,
    convert: converter,
  };

  if (fromto) {
    eachProps(src, copyWithFromto, opts);
    setParentEmptyObject(dst, fromto);
  } else {
    eachProps(src, copyWithoutFromto, opts);
  }

  return dst;
};

function copyWithFromto(value, keyChain, nodeInfo) {
  if (isPlainObject(value)) {
    return;
  }

  var dstKeyChains = nodeInfo.fromto[keyChain];
  if (!dstKeyChains) {
    return;
  }
  delete nodeInfo.fromto[keyChain];

  if (!Array.isArray(dstKeyChains)) {
    dstKeyChains = [dstKeyChains];
  }

  var srcInfo = {
    keyChain: keyChain,
    value: value,
    key: nodeInfo.name,
    depth: nodeInfo.depth,
    parent: nodeInfo.parent,
  };

  for (var i = 0, n = dstKeyChains.length; i < n; i++) {
    setDeep(nodeInfo.dest, dstKeyChains[i], function(parent, key, depth) {
      var dstInfo = {
        keyChain: dstKeyChains[i],
        value: parent[key],
        key: key,
        depth: depth,
        parent: parent,
      };

      return nodeInfo.convert(srcInfo, dstInfo);
    });
  }
}

function copyWithoutFromto(value, keyChain, nodeInfo) {
  if (isPlainObject(value)) {
    for (var k in value) {
      return;
    }
    setDeep(nodeInfo.dest, keyChain, newObject);
    return;
  }

  var srcInfo = {
    keyChain: keyChain,
    value: value,
    key: nodeInfo.name,
    depth: nodeInfo.depth,
    parent: nodeInfo.parent,
  };

  setDeep(nodeInfo.dest, keyChain, function(parent, key, depth) {
    var dstInfo = {
      keyChain: keyChain,
      value: parent[key],
      key: key,
      depth: depth,
      parent: parent,
    };

    return nodeInfo.convert(srcInfo, dstInfo);
  });
}

function newObject() {
  return {};
}

function noop(srcInfo) {
  return srcInfo.value;
}

function onlyValueIsString(obj) {
  var newObj = {};
  for (var key in obj) {
    var val = obj[key];
    if (typeof val === 'string') {
      newObj[key] = val;
    }
  }
  return newObj;
}

function arrayToObject(arr) {
  var obj = {};
  for (var i = 0, n = arr.length; i < n; i++) {
    var elm = arr[i];
    if (typeof elm === 'string') {
      obj[elm] = elm;
    }
  }
  return obj;
}

function invert(fromto) {
  var inv = {};
  for (var key in fromto) {
    var val = fromto[key];
    if (!inv[val]) {
      inv[val] = [];
    }
    inv[val].push(key);
  }
  return inv;
}

function setDeep(obj, keyChain, valueCreator) {
  _setDeep(obj, keyChain.split('.'), 1, valueCreator);
}

function _setDeep(obj, keyElems, depth, valueCreator) {
  var key = keyElems.shift();
  if (!keyElems.length) {
    var value = valueCreator(obj, key, depth);
    if (value === undefined) {
      return;
    }
    if (isPlainObject(value)) { // value is always an empty object.
      if (isPlainObject(obj[key])) {
        return;
      }
    }
    obj[key] = value;
    return;
  }

  if (!isPlainObject(obj[key])) {
    obj[key] = {};
  }
  _setDeep(obj[key], keyElems, depth + 1, valueCreator);
}

function setParentEmptyObject(obj, fromto) {
  for (var srcKeyChain in fromto) {
    var dstKeyChains = fromto[srcKeyChain];
    if (!Array.isArray(dstKeyChains)) {
      dstKeyChains = [dstKeyChains];
    }

    for (var i = 0, n = dstKeyChains.length; i < n; i++) {
      setDeep(obj, dstKeyChains[i], newUndefined);
    }
  }
}

function newUndefined() {
  return undefined;
}

function isObject(v) {
  return Object.prototype.toString.call(v) === '[object Object]';
}

},{"each-props":8,"is-plain-object":12}],7:[function(require,module,exports){
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

},{}],8:[function(require,module,exports){
'use strict';

var isPlainObject = require('is-plain-object');
var defaults = require('object.defaults/immutable');

module.exports = function(obj, fn, opts) {
  if (!isObject(obj)) {
    return;
  }

  if (typeof fn !== 'function') {
    return;
  }

  if (!isPlainObject(opts)) {
    opts = {};
  }

  forEachChild(obj, '', fn, 0, opts);
};

function forEachChild(node, baseKey, fn, depth, opts) {
  var keys = Object.keys(node);
  if (typeof opts.sort === 'function') {
    var sortedKeys = opts.sort(keys);
    if (Array.isArray(sortedKeys)) {
      keys = sortedKeys;
    }
  }

  depth += 1;

  for (var i = 0, n = keys.length; i < n; i++) {
    var key = keys[i];
    var keyChain = baseKey + '.' + key;
    var value = node[key];

    var nodeInfo = defaults(opts);
    nodeInfo.name = key;
    nodeInfo.index = i;
    nodeInfo.count = n;
    nodeInfo.depth = depth;
    nodeInfo.parent = node;

    var notDigg = fn(value, keyChain.slice(1), nodeInfo);
    if (notDigg || !isPlainObject(value)) {
      continue;
    }

    forEachChild(value, keyChain, fn, depth, opts);
  }
}

function isObject(v) {
  return Object.prototype.toString.call(v) === '[object Object]';
}


},{"is-plain-object":12,"object.defaults/immutable":14}],9:[function(require,module,exports){
/*!
 * for-in <https://github.com/jonschlinkert/for-in>
 *
 * Copyright (c) 2014-2017, Jon Schlinkert.
 * Released under the MIT License.
 */

'use strict';

module.exports = function forIn(obj, fn, thisArg) {
  for (var key in obj) {
    if (fn.call(thisArg, obj[key], key, obj) === false) {
      break;
    }
  }
};

},{}],10:[function(require,module,exports){
/*!
 * for-own <https://github.com/jonschlinkert/for-own>
 *
 * Copyright (c) 2014-2017, Jon Schlinkert.
 * Released under the MIT License.
 */

'use strict';

var forIn = require('for-in');
var hasOwn = Object.prototype.hasOwnProperty;

module.exports = function forOwn(obj, fn, thisArg) {
  forIn(obj, function(val, key) {
    if (hasOwn.call(obj, key)) {
      return fn.call(thisArg, obj[key], key, obj);
    }
  });
};

},{"for-in":9}],11:[function(require,module,exports){
'use strict'

const eachProps = require('each-props')
const isPlainObject = require('is-plain-object')

function instanceStringer (instance) {
  const props = propsStringer(instance)

  if (isPlainObject(instance)) {
    return props
  }

  return `${instance.constructor.name} ${props}`
}

function arrayStringer (array) {
  const elements = array.map(elem => {
    if (Array.isArray(elem)) {
      return arrayStringer(elem)
    }

    if (elem instanceof Object) {
      return instanceStringer(elem)
    }

    if (typeof elem === 'string') {
      return `'${elem}'`
    }

    return elem
  }).join(', ')

  return `[${elements}]`
}

function propsStringer (object) {
  let props = '',
      numOfClosingParenthesis = 0

  eachProps(object, (value, keyChain, info) => {
    if (info.index === 0) {
      props += '{ '
      numOfClosingParenthesis = info.depth

    } else {
      if (numOfClosingParenthesis > info.depth) {
        props += ' }'.repeat(numOfClosingParenthesis - info.depth)
        numOfClosingParenthesis = info.depth
      }
      props += ', '
    }

    if (Array.isArray(value)) {
      props += `${info.name}: ${arrayStringer(value)}`

    } else if (isPlainObject(value)) {
      props += `${info.name}: `
      if (! Object.keys(value).length) {
        props += '{}'
      }

    } else if (value instanceof Object) {
      props += `${info.name}: ${instanceStringer(value)}`

    } else if (typeof value === 'string') {
      props += `${info.name}: '${value}'`

    } else {
      try {
        props += `${info.name}: ${value}`
      } catch (e) {
        props += `${info.name}: {}`
      }
    }
  })

  props += ' }'.repeat(numOfClosingParenthesis)

  if (! props.length) {
    props = '{}'
  }

  return props
}

instanceStringer.propsStringer = propsStringer
instanceStringer.arrayStringer = arrayStringer

module.exports = instanceStringer

},{"each-props":8,"is-plain-object":12}],12:[function(require,module,exports){
/*!
 * is-plain-object <https://github.com/jonschlinkert/is-plain-object>
 *
 * Copyright (c) 2014-2017, Jon Schlinkert.
 * Released under the MIT License.
 */

'use strict';

var isObject = require('isobject');

function isObjectObject(o) {
  return isObject(o) === true
    && Object.prototype.toString.call(o) === '[object Object]';
}

module.exports = function isPlainObject(o) {
  var ctor,prot;

  if (isObjectObject(o) === false) return false;

  // If has modified constructor
  ctor = o.constructor;
  if (typeof ctor !== 'function') return false;

  // If has modified prototype
  prot = ctor.prototype;
  if (isObjectObject(prot) === false) return false;

  // If constructor does not have an Object-specific method
  if (prot.hasOwnProperty('isPrototypeOf') === false) {
    return false;
  }

  // Most likely a plain Object
  return true;
};

},{"isobject":13}],13:[function(require,module,exports){
/*!
 * isobject <https://github.com/jonschlinkert/isobject>
 *
 * Copyright (c) 2014-2017, Jon Schlinkert.
 * Released under the MIT License.
 */

'use strict';

module.exports = function isObject(val) {
  return val != null && typeof val === 'object' && Array.isArray(val) === false;
};

},{}],14:[function(require,module,exports){
'use strict';

var slice = require('array-slice');

var defaults = require('./mutable');

/**
 * Extends an empty object with properties of one or
 * more additional `objects`
 *
 * @name .defaults.immutable
 * @param  {Object} `objects`
 * @return {Object}
 * @api public
 */

module.exports = function immutableDefaults() {
  var args = slice(arguments);
  return defaults.apply(null, [{}].concat(args));
};

},{"./mutable":15,"array-slice":5}],15:[function(require,module,exports){
'use strict';

var each = require('array-each');
var slice = require('array-slice');
var forOwn = require('for-own');
var isObject = require('isobject');

/**
 * Extends the `target` object with properties of one or
 * more additional `objects`
 *
 * @name .defaults
 * @param  {Object} `target` The target object. Pass an empty object to shallow clone.
 * @param  {Object} `objects`
 * @return {Object}
 * @api public
 */

module.exports = function defaults(target, objects) {
  if (target == null) {
    return {};
  }

  each(slice(arguments, 1), function(obj) {
    if (isObject(obj)) {
      forOwn(obj, function(val, key) {
        if (target[key] == null) {
          target[key] = val;
        }
      });
    }
  });

  return target;
};

},{"array-each":4,"array-slice":5,"for-own":10,"isobject":13}]},{},[1])(1)
});
