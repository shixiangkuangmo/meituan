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
