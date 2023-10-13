# [class-config-base][repo-url] [![NPM][npm-img]][npm-url] [![MIT License][mit-img]][mit-url] [![Build Status][travis-img]][travis-url] [![Build Status][appveyor-img]][appveyor-url] [![Coverage Status][coverage-img]][coverage-url]

The base class of a configuration class which configures a interfacial class.

## Install

```
npm install class-config-base
```

### Load this module

For Node.js

```js
const ClassConfig = require('class-config-base')
```

For Web browser (only supporting es6)

```html
<script src="class-config-base.min.js"></script>
```

## Usage

1. Define default config object. This object determines **the property default values**, **the property structure** and **the property data types** of the class config class.

   ```js
   const defaultConfig = { top: 0, left: 0, right: 100, bottom: 50 }
   ```

2. Define the class config class.
    * `defineMorePrivates` method is optional and provides a timing to define more private data than private data defined by `defaultConfig`.
    * `defineAccessors` method is optional and creates descriptors to override property accessors.
    * `defineInterfaces` method creates descriptors to define properties and methods of the target interfacial class.

    ```js
    class RectangleConfig extends ClassConfig {
      constructor (initConfig, opts) {
        super(initConfig, defaultConfig, opts)
      }

      defineMorePrivates ($private) {
        $private.zoom = 1
        $private.zoomRange = { min: 0.2, max: 5 }
      }

      defineAccessors ($private, config) {
        return {
          zoom: { /* writable property */
            enumerable: true,
            get () { return $private.zoom },
            set (v) {
              v = Math.max(v, config.zoomRange.min)
              v = Math.min(v, config.zoomRange.max)
              $private.zoom = v
            },
          },
        }
      }
      
      get width () { return this.right - this.left }
      get height () { return this.bottom - this.top }

      defineInterfaces (config, instance) {
        return {
          width: { /* writable property */
            enumerable: true,
            get () { return config.width * config.zoom },
            set (v) { config.right = config.left + v / config.zoom },
          },
          height: { /* writable property */
            enumerable: true,
            get () { return config.height * config.zoom },
            set (v) { config.bottom = config.top + v / config.zoom },
          },
          area: { /* replaceable property */
            enumerable: true,
            configurable: true,
            set (value) { Object.defineProperty(instance, 'area', {
              enumerable: true,
              configuable: true,
              writable: true,
              value,
            }) },
            get () {
              return config.width * config.zoom * config.height * config.zoom
            },
          },
          inflate: { /* method property */
            enumerable: true,
            configurable: true,
            writable: true,
            value: (dw, dh) => {
              config.right += dw
              config.bottom += dh
            },
          },
        }
      }
    }
    ```

    This module provides some useful functions to define accessors/interfaces simply.
    By using these functions, the above example can be rewritten as follows:

    ```js
    const { readonly, writable, replaceable, method } = ClassConfig

    class RectangleConfig extends ClassConfig {

      constructor (initConfig, opts) {
        super(initConfig, defaultConfig, opts)
      }

      defineMorePrivates ($private) {
        $private.zoom = 1
        $private.zoomRange = { min: 0.2, max: 5 }
      }

      defineAccessors ($private, config) {
        return {
          zoom: writable({
            get () { return $private.zoom },
            set (v) {
              v = Math.max(v, config.zoomRange.min)
              v = Math.min(v, config.zoomRange.max)
              $private.zoom = v
            },
          }),
        }
      }
      
      get width () { return this.right - this.left }
      get height () { return this.bottom - this.top }

      defineInterfaces (config, instance) {
        return {
          width: writable({
            get () { return config.width * config.zoom },
            set (v) { config.right = config.left + v / config.zoom },
          }),
          height: writable({
            get () { return config.height * config.zoom },
            set (v) { config.bottom = config.top + v / config.zoom },
          }),
          area: replaceable({
            get () {
              return config.width * config.zoom * config.height * config.zoom
            },
          }),
          inflate: method((dw, dh) => {
            config.right += dw
            config.bottom += dh
          }),
        }
      }
    }
    ```

3. Define the interfacial class with the class config.

    ```js
    class Rectangle {
      constructor (config) {
        config.configure(this)
      }
    }
    ```

    The interfaces of interfacial class can be also defined by following way:

    ```js
    class RectangleConfig extends ClassConfig {
      constructor (initConfig, opts) { ... }
      defineMorePrivates ($private) { ... }
      defineAccessors ($private, config) { ... }
    }

    class Rectangle {
      constructor (config) {
        config.configure(this, {
          width: writable({
            get () { return config.width * config.zoom },
            set (v) { config.right = config.left + v / config.zoom },
          }),
          height: writable({
            get () { return config.height * config.zoom },
            set (v) { config.bottom = config.top + v / config.zoom },
          }),
          area: replaceable({
            get () {
              return config.width * config.zoom * config.height * config.zoom
            },
          }),
          inflate: method((dw, dh) => {
            config.right += dw
            config.bottom += dh
          }),
        })
      }
    }
    ```

4. Instantiate and use the interfacial class.

    ```js
    const rectConfig = new RectangleConfig()
    const rect = new Rectangle(rectConfig)
    
    console.log(rect.toString()) // => [object Rectangle]
    console.log(Object.prototype.toString.call(rect)) // => [object Rectangle]
    console.log(rectConfig.toString())
    // => RectangleConfig { top: 0, left: 0, right: 100, bottom: 50, zoom: 1, zoomRange: { min: 0.2, max: 5 } }
    
    console.log(rect.width) // => 100
    console.log(rect.height) // => 50
    console.log(rect.area) // => 5000
    
    rect.inflate(10, 20)
    console.log(rectConfig.toString())
    // => RectangleConfig { top: 0, left: 0, right: 110, bottom: 70, zoom: 1, zoomRange: { min: 0.2, max: 5 } }
    console.log(rect.width) // => 110
    console.log(rect.height) // => 70
    console.log(rect.area) // => 7700
    ```

5. A property value, even if it is read-only or hidden, can be updated with the class config object.

    ```js
    rectConfig.zoom = 0
    console.log(rectConfig.toString())
    // => RectangleConfig { top: 0, left: 0, right: 110, bottom: 70, zoom: 0.2, zoomRange: { min: 0.2, max: 5 } }
    console.log(rect.width) // => 22
    console.log(rect.height) // => 14
    console.log(rect.area) // => 308
    
    rectConfig.right = 160
    rectConfig.bottom = 120
    console.log(rectConfig.toString())
    // => RectangleConfig { top: 0, left: 0, right: 160, bottom: 120, zoom: 0.2, zoomRange: { min: 0.2, max: 5 } }
    console.log(rect.width) // => 32
    console.log(rect.height) // => 24
    console.log(rect.area) // => 768
    ```

### Manage a config object and interfacial object

A mapping between a config class instance and a interfacial class instance can be managed by `ClassConfig.Manager` object.

```js
const { Manager } = ClassConfig

const manager = new Manager()  // Create a manager

manager.set(rectConfig, rect)  // Set a mapping

const aConfig = manager.getConfig(rect)  // Get the configure object
const aRect = manager.getObject(rectConfig)  // Get the interfacial object

manager.delete(aRect)  // Delete a mapping
```

### Share private data with another config object

A config object can share its private data (`config.$private`) with another config object, as follows:

```
const config1 = new RectangleConfig({ top: 1, left: 2, right: 12, bottom: 21 })
const config2 = new RectangleConfig(config1, { sharePrivate: true })

console.log(config1.toString())
// => RectangleConfig { top: 1, left: 2, right: 12, bottom: 21, zoom: 1, zoomRange: { min: 0.2, max: 5 } }
console.log(config2.toString())
// => RectangleConfig { top: 1, left: 2, right: 12, bottom: 21, zoom: 1, zoomRange: { min: 0.2, max: 5 } }

config1.right = 102
console.log(config1.toString())
// => RectangleConfig { top: 1, left: 2, right: 102, bottom: 21, zoom: 1, zoomRange: { min: 0.2, max: 5 } }
console.log(config2.toString())
// => RectangleConfig { top: 1, left: 2, right: 102, bottom: 21, zoom: 1, zoomRange: { min: 0.2, max: 5 } }
```   

## API

### <u>class ClassConfig</u>

Is a class to configure the target class instance from hiding place.

#### <u>.constructor (initConfig, defaultConfig, opts) => ClassConfig</u>

Is a constructor to creates an instance of this class.
*initConfig* and *defaultConfig* are objects and can be nested objects.
*defaultConfig* is to specify the default values and the types of the properties.
So if a type of a property in *initConfig* is different from a type of a corresponding property in *defaultConfig*, the property value in *initConfig* is ignored.

**Parameters:**

| Parameter       |  Type  | Description                            |
|:----------------|:------:|:---------------------------------------|
| *initConfig*    | object | A configuration object which has initial property values. |
| *defaultConfig* | object | A configuration object which has default property values. |
| *opts*          | object | A option object (Optional) |

**Propeties of <i>opts</i>:**

| Property        |  Type   | Description                            |
|:----------------|:-------:|:---------------------------------------|
| sharePrivate    | boolean | True, if sharing `.$private` of `initConfig` which is `ClassConfig` object. (By default, falsy) | 

**Returns:**

A `ClassConfig` object.

#### <u>.configure (instance, descriptors) => Void</u>

Configures the interfaces of the target class instance in its constructor.

**Parameters:**

| Parameter     |  Type  | Description                        |
|:--------------|:------:|:-----------------------------------|
| *instance*    | object | A class instance to be configured. |
| *descriptors* | object | A plain object which has descriptors of interfaces of the target class instance. |

#### <u>.defineMorePrivates ($private) => Void</u>

Defines more private data than private data defined in `defaultConfig`.

**Parameters:**

| Parameter     |  Type  | Description                        |
|:--------------|:------:|:-----------------------------------|
| *$private*    | object | The root object to store private data of the config object. |

#### <u>.defineAccessors ($private, config) => object</u>

Returns an object which maps between property key chains and property descriptors.
A key chain is a string that concatenates all keys in a key path with dots. A descriptor is a thing used by `Object.defineProperty`.

This method is used to override accessors of the config class.

**Parameters:**

| Parameter     |  Type  | Description                               |
|:--------------|:------:|:------------------------------------------|
| *$private*    | object | The root object to store private data of the config object. |
| *config*      | `ClassConfig` | This config object.                |

**Returns:**

A nested plain object which contains property descriptors of accessors of this config object.

#### <u>.defineInterfaces (config, instance) => Void</u>

Returns an object which maps between property names and property descriptors. A descriptor is a thing used by `Object.defineProperty`.

This method defines the interfaces of the target class.

**Parameters:**

| Parameter     |  Type  | Description                        |
|:--------------|:------:|:-----------------------------------|
| *config*      | `ClassConfig` | This config object.                |
| *instance*    | object | The instance of the interfacial class configured by this config object. |

#### <u>[static] .readonly ({ getter [, enumerable ] }) => object</u>

Returns a readonly property descriptor.

**Parameters:**

| Parameter    |   Type   | Description                              |
|:-------------|:--------:|:-----------------------------------------|
| *getter*     | function | A getter for this property.              |
| *enumerable* | boolean  | A flag to show this property during enumeration of the properties. |

**Return:**

A property descriptor of the target readonly property.

#### <u>[static] .writable ({ getter, setter, [, enumerable ] [, configurable ] }) => object</u>

Returns a writable property descriptor.

| Parameter    |   Type   | Descriptor                                |
|:-------------|:--------:|:------------------------------------------|
| *getter*     | function | A getter for this property.               |
| *setter*     | function | A setter for this property.               |
| *enumerable* | boolean  | A flag to show this property during enumeration of the properties. |
|*configurable*| boolean  | A flag to change or delete this property. |

**Return:**

A property descriptor of the target writable property.

#### <u>[static] .replaceable ({ getter [, enumerable ] }) => object</u>

Returns a replaceable property descriptor.

**Parameters:**

| Parameter    |   Type   | Description                              |
|:-------------|:--------:|:-----------------------------------------|
| *get*        | function | A getter for this property.              |
| *enumerable* | boolean  | A flag to show this property during enumeration of the properties. |

**Return:**

A property descriptor of the target replaceable property.

#### <u>[static] .method (fn) : object</u>

Returns a property descriptor for a method.

**Parameters:**

| Parameter    |   Type   | Description                              |
|:-------------|:--------:|:-----------------------------------------|
| *fn*         | function | A method function for this property.     |

**Return:**

A property descriptor of the target method property.

### <u>class ClassConfig.Manager</u>

Is a manager class which has mappings of a config object and an object configured by it.

#### <u>.constructor () => ClassConfig.Manager</u>

Creates an instance of this class.

**Returns:**

A `ClassConfig.Manager` object.

#### <u>.set (object, config) => Void</u>

Sets a mapping of a config object and an object configured by it.

**Parameters:**

| Parameter     |  Type      | Description                                 |
|:--------------|:----------:|:--------------------------------------------|
| *object*      | object     | The object configured by the config object. |
| *config*      | `ClassConfig` | The config object.                       |

#### <u>.delete (objectOrConfig) => Void</u>

Deletes a mapping of a config object and an object configured by it.

**Parameters:**

| Parameter        |            Type           | Description                |
|:-----------------|:-------------------------:|:---------------------------|
| *objectOrConfig* | object &#124;`ClassConfig`| The object or config object to be deleted its mapping from this manager object. |

#### <u>.getConfig (object) => ClassConfig</u>

Gets a config object corresponding to the specified object.

**Parameters:**

| Parameter     |  Type  | Description                                     |
|:--------------|:------:|:------------------------------------------------|
| *object*      | object | The object registered with this manager object. |

**Returns:**

The config object corresponding to the specified object.

#### <u>.getObject (config) => object</u>

Get an object corresponding to the specified config object.

**Parameters:**

| Parameter     |      Type     | Description                               |
|:--------------|:-------------:|:------------------------------------------|
| *config*      | `ClassConfig` | The config object registered with this manager object. |

**Returns:**

The object corresponding to the specified config object.

## License

Copyright (C) 2017-2018 Takayuki Sato

This program is free software under [MIT][mit-url] License.
See the file LICENSE in this distribution for more details.

[repo-url]: https://github.com/sttk/class-config-base/
[npm-img]: https://img.shields.io/badge/npm-v1.1.0-blue.svg
[npm-url]: https://www.npmjs.org/package/class-config-base/
[mit-img]: https://img.shields.io/badge/license-MIT-green.svg
[mit-url]: https://opensource.org/license.MIT
[travis-img]: https://travis-ci.org/sttk/class-config-base.svg?branch=master
[travis-url]: https://travis-ci.org/sttk/class-config-base
[appveyor-img]: https://ci.appveyor.com/api/projects/status/github/sttk/class-config-base?branch=master&svg=true
[appveyor-url]: https://ci.appveyor.com/project/sttk/class-config-base
[coverage-img]: https://coveralls.io/repos/github/sttk/class-config-base/badge.svg?branch=master
[coverage-url]: https://coveralls.io/github/sttk/class-config-base?branch=master
