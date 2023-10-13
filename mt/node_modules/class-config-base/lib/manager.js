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
