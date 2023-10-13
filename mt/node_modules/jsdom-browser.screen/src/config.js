'use strict'

// https://www.w3.org/TR/cssom-view-1/
// https://www.w3.org/TR/2016/WD-cssom-view-1-20160317/
// (4.3) #the-screen-interface

// https://www.w3.org/TR/screen-orientation/
// https://www.w3.org/TR/2018/WD-screen-orientation-20180706/
// (3.1) #extensions-to-the-screen-interface

const Config = require('class-config-base')
const { readonly, writable } = Config
const defaultNumber = require('default-number')
const defaultConfig = require('./default')
const calcScreenAngle = require('./lib/calc-screen-angle')

class ScreenConfig extends Config {
  constructor (initConfig, opts) {
    super(initConfig, defaultConfig, opts)

    let configManager
    if (initConfig && initConfig.$configManager) {
      configManager = initConfig.$configManager
    } else {
      configManager = new Config.Manager()
    }
    Object.defineProperty(this, '$configManager', { value: configManager })
  }

  configure (screen, descriptors) {
    super.configure(screen, descriptors)
    this.$configManager.set(screen, this)
  }

  defineMorePrivates (priv) {
    priv.baseAngle = calcScreenAngle(priv.deviceAngle)

    Object.defineProperty(priv, 'screenAngle', {
      enumerable: true,
      configurable: true,
      get: () => calcScreenAngle(priv.deviceAngle),
      set: () => {},
    })
  }

  static calcScreenAngle (deviceAngle) {
    return calcScreenAngle(deviceAngle)
  }

  defineAccessors (priv) {
    return {
      width: writable({
        get: () => priv.width,
        set: v => { priv.width = defaultNumber(v, priv.width, 0) },
      }),

      height: writable({
        get: () => priv.height,
        set: v => { priv.height = defaultNumber(v, priv.height, 0) },
      }),

      availTop: writable({
        get: () => priv.availTop,
        set: v => { priv.availTop = defaultNumber(v, priv.availTop, 0) },
      }),

      availLeft: writable({
        get: () => priv.availLeft,
        set: v => { priv.availLeft = defaultNumber(v, priv.availLeft, 0) },
      }),

      availRight: writable({
        get: () => priv.availRight,
        set: v => { priv.availRight = defaultNumber(v, priv.availRight, 0) },
      }),

      availBottom: writable({
        get: () => priv.availBottom,
        set: v => { priv.availBottom = defaultNumber(v, priv.availBottom, 0) },
      }),

      screenAngle: readonly({
        get: () => priv.screenAngle,
      }),

      deviceAngle: writable({
        get: () => priv.deviceAngle,
        set: v => {
          priv.deviceAngle = defaultNumber(v, priv.deviceAngle)
        }
      }),
    }
  }

  defineInterfaces (cfg, inst) {
    return {
      width: readonly({
        get: () => {
          switch (positiveAngle(cfg.screenAngle - cfg.baseAngle)) {
            case 90:
            case 270:
              return cfg.height
            default:
              return cfg.width
          }
        }
      }),

      height: readonly({
        get: () => {
          switch (positiveAngle(cfg.screenAngle - cfg.baseAngle)) {
            case 90:
            case 270:
              return cfg.width
            default:
              return cfg.height
          }
        }
      }),

      availTop: readonly({
        get: () => cfg.availTop
      }),

      availLeft: readonly({
        get: () => cfg.availLeft
      }),

      availWidth: readonly({
        get: () => Math.max(0,  inst.width - cfg.availLeft - cfg.availRight)
      }),

      availHeight: readonly({
        get: () => Math.max(0, inst.height - cfg.availTop - cfg.availBottom)
      }),

      colorDepth: readonly({
        get: () => 24
      }),

      pixelDepth: readonly({
        get: () => 24
      }),
    }
  }
}

function positiveAngle (angle) {
  return (angle < 0) ? (360 + angle) : angle
}

module.exports = ScreenConfig
