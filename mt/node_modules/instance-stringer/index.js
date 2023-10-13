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
