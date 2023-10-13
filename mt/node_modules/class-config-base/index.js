'use strict'

const Config = require('./lib/config')
const Manager = require('./lib/manager')

Object.defineProperty(Config, 'Manager', {
  enumerable: true,
  value: Manager,
})

module.exports = Config
