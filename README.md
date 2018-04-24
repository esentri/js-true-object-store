# TrueObjectStore

[![Build Status](https://travis-ci.org/esentri/js-true-object-store.svg?branch=master)](https://travis-ci.org/esentri/js-true-object-store)
[![Coverage Status](https://coveralls.io/repos/github/esentri/js-true-object-store/badge.svg?branch=master)](https://coveralls.io/github/esentri/js-true-object-store?branch=master)

This project wraps [IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API) so objects can be stored and loaded as
objects (and not as data structures).

In addition promises are used for a better coding flow.

## Usage

### With SimpleIndexedDB

```
class TestClass {
    constructor(key) {
       this.key = key
    }
    
    printKey() {
       console.log('my key: ', key)
    }
}

let trueObjectStore = new TrueObjectStoreBuilder().
         .name('myObjectStoreName')
         .parameters({keyPath: 'key'})
         .deserializer(Deserializer.simple(TestClass))
         .build()
let simpleIndexedDB = new SimpleIndexedDBBuilder()
         .name('testDB1')
         .dbVersion(1)
         .objectStores([trueObjectStore])
         .build()

simpleIndexedDB.open().then(() => {
   trueObjectStore.save(new TestClass('test')).then(() => {
      trueObjectStore.load('test').then(loadedObject => {
         loadedObject.printKey()
      })
   })
})
```

### Without SimpleIndexedDB

```
let trueObjectStore = new TrueObjectStoreBuilder().
         .name('myObjectStoreName')
         .parameters({keyPath: 'key'})
         .database(myDatabase)
         .deserializer(Deserializer.simple(TestClass))
         .build()
         
// if the store is new you need to call <onUpgradeNeeded>
// NOTE: the database needs to be open for this call
trueObjectStore.onUpgradeNeeded()

trueObjectStore.save(new TestClass('test')).then(() => {
   trueObjectStore.load('test').then(loadedObject => {
      loadedObject.printKey()
   })
})
```

# Limitations

Currently, you cannot use a _get_ function as a key. E.g. the following class
```
class TestClass {

   constructor(key) {
      this._key = key
   }

   get key() {
      return this._key
   }
}
```
will fail if you choose `{keyPath: 'key'}'`. You need to select a real field. In this case
`{keyPath: '_key'}`.



# Projects used

* [@esentri/de-serialize](https://github.com/esentri/js-de-serializer)
  * License: MIT
  * for (de-)serializing from/to objects/datastructures
* [fake-indexeddb](https://github.com/dumbmatter/fakeIndexedDB)
  * License: Apache 2.0
  * for testing against the IndexedDB API
  

* [Typescript Library Starter](https://github.com/alexjoverm/typescript-library-starter)
  * License: MIT
  * as a template for the setup
  * <details>
   <summary>Typescript Library Starter dependencies</summary>

  * [JEST](https://facebook.github.io/jest/)
    * License: MIT
  * [Colors](https://github.com/Marak/colors.js)
    * License: MIT
  * [Commitizen](https://github.com/commitizen/cz-cli)
    * License: MIT
  * [Definitley Typed](https://github.com/DefinitelyTyped/DefinitelyTyped)
    * License: MIT
  * [Coveralls](https://github.com/nickmerwin/node-coveralls)
    * License: BSD-2-Clause
  * [Cross-env](https://github.com/kentcdodds/cross-env)
    * License: MIT
  * [cz-conventional-changelog](https://github.com/commitizen/cz-conventional-changelog)
    * License: MIT
  * [Husky](https://github.com/typicode/husky)
    * License: MIT
  * [lint-staged](https://github.com/okonet/lint-staged)
    * License: MIT
  * [lodash.camelcase](https://github.com/lodash/lodash)
    * License: MIT
  * [Prompt](https://github.com/flatiron/prompt)
    * License: MIT
  * [replace-in-file](https://github.com/adamreisnz/replace-in-file)
    * License: MIT
  * [rimraf](https://github.com/isaacs/rimraf)
    * License: ISC
  * [rollup](https://github.com/rollup/rollup)
    * License: MIT
  * [semantic-release](https://github.com/semantic-release/semantic-release)
    * License: MIT
  * [tslint](https://github.com/palantir/tslint)
    * License: Apache-2.0
  * [typedoc](http://typedoc.org/)
    * License: Apache-2.0
  * [typescript](http://typescriptlang.org/)
    * License: Apache-2.0 
  * [validate-commit-msg](https://github.com/conventional-changelog/validate-commit-msg)
    * License: MIT
</details>


# License

MIT License

Copyright (c) 2018 esentri AG

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
