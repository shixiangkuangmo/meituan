[default-number][repo-url] [![NPM][npm-img]][npm-url]  [![MIT License][mit-img]][mit-url] [![Build Status][travis-img]][travis-url] [![Build Status][appveyor-img]][appveyor-url] [![Coverage Status][coverage-img]][coverage-url]
================

Get a default number when a number is a non-number, a NaN or out of range.

Install
-------

```
$ npm i default-number --save
```

Usage
-----

* Load this module :

    ```js
    const defaultNumber = require('default-number')
    ```

* Return the default number when the value is undefined or null.

    ```js
    defaultNumber(undefined, 123) // => 123
    defaultNumber(null, 123) // => 123
    ```

* Return the default number when the value is NaN.

    ```js
    defaultNumber(NaN, 123) // => 123
    defaultNumber(Infinity, 123) // => Infinity
    ```

* Return the limited number when minValue and/or maxValue is specified.

    ```js
    defaultNumber(-100, 123, -50) // => -50
    defaultNumber(1000, 123, -50, 200) // => 200
    defaultNumber(1000, 123, null, 200) // => 200
    ```
    
* And return the value when it is valid and in range.

    ```js
    defaultNumber(-10, 123) // => -10
    defaultNumber(-10, 123, -50, 200) // => -10
    defaultNumber(100, 123, null, 200) // => 100
    ```

API
---

### <u>defaultNumber(value, defValue [, minValue [, maxValue]]) => number</u>

Returns the second argument when the first argument is non-number or `NaN`.
When the third and/or fourth argument are specified, the returned value is limited in range.

* **Arguments:**

    * **value** [number] : a value to be evaluated.
    * **defValue** [number] : a default value which is returned if **value** is non-number or NaN.
    * **minValue** [number] : a minimum value of limitation range. (optional)
    * **maxValue** [number] : a maximum value of limitation range. (optional)

* **Return [any] :** **value** if it is a number and in range, **defValue** if **value** is non-number and **defValue** is in range, **minValue** if **value/defValue** is less **minValue**, or **maxValue** if **value/defValue** is greater than **maxValue**.

License
-------

Copyright (C) 2017 Takayuki Sato

This program is free software under [MIT][mit-url] License.
See the file LICENSE in this distribution for more details.

[repo-url]: https://github.com/sttk/default-number/
[npm-img]: https://img.shields.io/badge/npm-v0.1.0-blue.svg
[npm-url]: https://www.npmjs.org/package/default-number/
[mit-img]: https://img.shields.io/badge/license-MIT-green.svg
[mit-url]: https://opensource.org/license.MIT
[travis-img]: https://travis-ci.org/sttk/default-number.svg?branch=master
[travis-url]: https://travis-ci.org/sttk/default-number
[appveyor-img]: https://ci.appveyor.com/api/projects/status/github/sttk/default-number?branch=master&svg=true
[appveyor-url]: https://ci.appveyor.com/project/sttk/default-number
[coverage-img]: https://coveralls.io/repos/github/sttk/default-number/badge.svg?branch=master
[coverage-url]: https://coveralls.io/github/sttk/default-number?branch=master
