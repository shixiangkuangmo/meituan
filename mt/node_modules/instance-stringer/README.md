# [instance-stringer][repo-url] [![NPM][npm-img]][npm-url] [![MIT License][mit-img]][mit-url] [![Build Status][travis-img]][travis-url] [![Build Status][appveyor-img]][appveyor-url] [![Coverage Status][coverage-img]][coverage-url]

Converts a content of a class instance to a string.

## Install

To install from npm:

```
$ npm i instance-stringer --save
```

### Load this module

For Node.js

```js
const instanceStringer = require('instance-stringer')
const { propsStringer, arrayStringer } = instanceStringer
```

For Web browser (only supporting es6):

```html
<script src="instance-stringer.min.js"></script>
<script>
const { propsStringer, arrayStringer } = instanceStringer
</script>
```

## Usage

Converts content of the instance of `MyClass` :

```js
class SubClass {
  constructor() {
    this.p = 1
    this.q = 2
  }
}
class MyClass {
  constructor() {
    this.a = 123
    this.b = { c: 'A', d: [{ g: 1, h: 2 }, 3], e: new SubClass() }
  }
}

const myInstance = new MyClass()

instanceStringer(myInstance)
// => "MyClass { a: 123, b: { c: 'A', d: [{ g: 1, h: 2 }, 3], e: SubClass { p: 1, q: 2 } } }"

propsStringer(myInstance)
// => "{ a: 123, b: { c: 'A', d: [{ g: 1, h: 2 }, 3], e: SubClass { p: 1, q: 2 } } }"


arrayStringer(myInstance.b.d)
// => "[{ g: 1, h: 2 }, 3]"
```

## API

### <u>instanceStringer(instance) : string</u>

Converts content of class instance to a string with its class name.
If the instance is a plain object its class name (`Object`) is not output.

### <u>propsStringer(object) : string</u>

Converts properties of a plain object or a class instance to a string  without its class name.

### <u>arrayStringer(array) : string</u>

Converts elements of an array to a string.


## License

Copyright (C) 2017-2018 Takayuki sato

This program is free software under [MIT][mit-url] License.
See the file LICENSE in this distribution for more details.

[repo-url]: https://github.com/sttk/instance-stringer/
[npm-img]: https://img.shields.io/badge/npm-v1.0.0-blue.svg
[npm-url]: https://www.npmjs.org/package/instance-stringer/
[mit-img]: https://img.shields.io/badge/license-MIT-green.svg
[mit-url]: https://opensource.org/license.MIT
[travis-img]: https://travis-ci.org/sttk/instance-stringer.svg?branch=master
[travis-url]: https://travis-ci.org/sttk/instance-stringer
[appveyor-img]: https://ci.appveyor.com/api/projects/status/github/sttk/instance-stringer?branch=master&svg=true
[appveyor-url]: https://ci.appveyor.com/project/sttk/instance-stringer
[coverage-img]: https://coveralls.io/repos/github/sttk/instance-stringer/badge.svg?branch=master
[coverage-url]: https://coveralls.io/github/sttk/instance-stringer?branch=master

