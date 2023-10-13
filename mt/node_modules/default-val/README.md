[default-value][repo-url] [![NPM][npm-img]][npm-url] [![MIT License][mit-img]][mit-url] [![Build Status][travis-img]][travis-url] [![Build Status][appveyor-img]][appveyor-url] [![Coverage Status][coverage-img]][coverage-url]
===============

Get a default value when a value is nullish or invalid type

Install
-------

```
$ npm i default-val --save
```

Usage
-----

* Load this mudule :

    ```js
    const defaultValue = require('default-val');
    ```

* Return the default value when the value is undefined or null :

    ```js
    defaultValue(undefined, true) // => true
    defaultValue(null, 123) // => 123
    ```

* Return the default value when the value is NaN :

    ```js
    defaultValue(NaN, 123) // => 123
    defaultValue(Infinity, 123) // => Infinity
    ```

* Return the default value when the type of the value is invalid :

    ```js
    defaultValue(987, true) // => true
    defaultValue(987, 'ABC', 'string') // => 'ABC'
    defaultValue(987, 'ABC', '[object String]') // => 'ABC'
    defaultValue(987, 123, '[object String]') // => 123
    defaultValue(987, new Date(0), '[object Date]') // => new Date(0)
    ```

* And return the value when it is valid :

    ```js
    defaultValue(987, 0) // => 987
    defaultValue(987, 123, 'number') // => 987
    defaultValue(987, null, 'number') // => 987
    defaultValue(987, 'ABC', '[object Number]') // => 987
    ```

API
---

### <u>defaultValue(value, defValue [, type]) => any</u>

Returns the second argument when the first argument is `null`, `undefined` or `NaN`, or the type of the first argument is different from the type of the second argument.
When the third argument is specified, returns the second argument if the type of the first argument is different from the type represented by the third argument.
The third argument can be specified the result of `typeof x` or `Object.prototype.toString.call(x)`.

* **Arguments:**

    * **value** [any] : a value to be evaluated.
    * **defValue** [any] : a default value which is returned if **value** is invalid.
    * **type** [string] : a type for a valid value. (optional)

* **Return** [any] : **value** if **value** is valid, otherwise **defValue**.

License
-------

Copyright (C) 2017 Takayuki Sato

This program is free software under [MIT][mit-url] License.
See the file LICENSE in this distribution for more details.

[repo-url]: https://github.com/sttk/default-value/
[npm-img]: https://img.shields.io/badge/npm-v0.1.5-blue.svg
[npm-url]: https://www.npmjs.org/package/default-val/
[mit-img]: https://img.shields.io/badge/license-MIT-green.svg
[mit-url]: https://opensource.org/license.MIT
[travis-img]: https://travis-ci.org/sttk/default-value.svg?branch=master
[travis-url]: https://travis-ci.org/sttk/default-value
[appveyor-img]: https://ci.appveyor.com/api/projects/status/github/sttk/default-value?branch=master&svg=true
[appveyor-url]: https://ci.appveyor.com/project/sttk/default-value
[coverage-img]: https://coveralls.io/repos/github/sttk/default-value/badge.svg?branch=master
[coverage-url]: https://coveralls.io/github/sttk/default-value?branch=master

