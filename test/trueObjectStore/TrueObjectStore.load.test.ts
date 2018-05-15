import {TrueObjectStore} from '../../src/TrueObjectStore'
import * as IndexDB from 'fake-indexeddb'
import {TrueObjectStoreBuilder} from '../../src/TrueObjectStoreBuilder'
import {Deserializer} from '@esentri/de-serializer'
import {SimpleIndexedDBBuilder} from '../../src/SimpleIndexedDBBuilder'

class KeyClass {
   private _key: string

   constructor (key: string) {
      this._key = key
   }

   get key () {
      return this._key
   }
}

class TestClass {
   public key: string = 'key'
   public a: string = 'first'
   public b: any = {
      c: 'nested'
   }

   public setNested (nested: string) {
      this.b.c = nested
   }

   public nested () {
      return this.b.c
   }
}

class TestClassCustomDeserialize {
   private field: string = 'init'

   public value (): string {
      return this.field
   }

   public static deserialize (dataStructure: any): Promise<TestClassCustomDeserialize> {
      return new Promise(resolve => {
         let deserialized = new TestClassCustomDeserialize()
         deserialized.field = 'deserialized'
         resolve(deserialized)
      })
   }
}

describe('TrueObjectStore test loading', () => {

   let dbName = 'TrueObjectStoreLoading'
   let dbVersion = 0

   it('simple load test', done => {
      dbVersion++
      let objectStoreName = 'simpleLoad'
      let trueObjectStore: TrueObjectStore<string, TestClass> =
         new TrueObjectStoreBuilder<string, TestClass>()
            .name(objectStoreName)
            .deserializer(Deserializer.simple(TestClass))
            .parameters({autoIncrement: true, keyPath: 'key'})
            .build()
      let simpleIndexedDB = new SimpleIndexedDBBuilder()
         .name(dbName)
         .databaseFactory(IndexDB.default)
         .dbVersion(dbVersion)
         .objectStores([trueObjectStore])
         .build()
      simpleIndexedDB.open().then(() => {
         let savedObject = new TestClass()
         trueObjectStore.save(savedObject).then(() => {
            trueObjectStore.value(savedObject.key).then(loadedObject => {
               expect(loadedObject.nested()).toEqual(savedObject.nested())
               simpleIndexedDB.close()
               done()
            })
         })
      })
   })

   it('load object with custom deserializer', done => {
      dbVersion++
      let objectStoreName = 'customDeserializer'
      let trueObjectStore: TrueObjectStore<string, TestClassCustomDeserialize> =
         new TrueObjectStoreBuilder<string, TestClassCustomDeserialize>()
            .name(objectStoreName)
            .deserializer(Deserializer.simple(TestClassCustomDeserialize))
            .parameters({autoIncrement: true, keyPath: 'field'})
            .build()
      let simpleIndexedDB = new SimpleIndexedDBBuilder()
         .name(dbName)
         .databaseFactory(IndexDB.default)
         .dbVersion(dbVersion)
         .objectStores([trueObjectStore])
         .build()
      simpleIndexedDB.open().then(() => {
         let savedObject = new TestClassCustomDeserialize()
         trueObjectStore.save(savedObject).then(() => {
            trueObjectStore.value(savedObject.value()).then(loadedObject => {
               expect(loadedObject.value()).toEqual('deserialized')
               simpleIndexedDB.close()
               done()
            })
         })
      })
   })

   it('nested key path simple', done => {
      let objectStoreName = 'test'
      let dbName = 'db4'
      let trueObjectStore: TrueObjectStore<string, TestClass> =
         new TrueObjectStoreBuilder<string, TestClass>()
            .name(objectStoreName)
            .deserializer(Deserializer.simple(TestClass))
            .parameters({autoIncrement: true, keyPath: 'b.c'})
            .build()
      let simpleIndexedDB = new SimpleIndexedDBBuilder()
         .name(dbName)
         .databaseFactory(IndexDB.default)
         .objectStores([trueObjectStore])
         .build()
      simpleIndexedDB.open().then(() => {
         let savedObject = new TestClass()
         let nested = 'new value'
         savedObject.setNested(nested)
         trueObjectStore.save(savedObject).then(() => {
            trueObjectStore.value(savedObject.b.c).then(loadedObject => {
               expect(loadedObject.nested()).toEqual(nested)
               simpleIndexedDB.close()
               done()
            })
         })
      })
   })

   it('nested key path object', done => {
      dbVersion++
      let objectStoreName = 'nestedKeyObject'
      let trueObjectStore: TrueObjectStore<any, TestClass> =
         new TrueObjectStoreBuilder<any, TestClass>()
            .name(objectStoreName)
            .deserializer(Deserializer.simple(TestClass))
            .parameters({autoIncrement: true, keyPath: 'b.c'})
            .build()
      let simpleIndexedDB = new SimpleIndexedDBBuilder()
         .name(dbName)
         .databaseFactory(IndexDB.default)
         .dbVersion(dbVersion)
         .objectStores([trueObjectStore])
         .build()
      simpleIndexedDB.open().then(() => {
         let savedObject = new TestClass()
         let nested = 'new value'
         savedObject.setNested(nested)
         trueObjectStore.save(savedObject).then(() => {
            trueObjectStore.value({c: nested}).then(loadedObject => {
               expect(loadedObject.nested()).toEqual(nested)
               simpleIndexedDB.close()
               done()
            })
         })
      })
   })

   // FakeIndexedDB does not support array
   // it('nested key as array', done => {
   //    dbVersion++
   //    let objectStoreName = 'nestedKeyAsArray'
   //    let trueObjectStore: TrueObjectStore<any, TestClass> =
   //       new TrueObjectStoreBuilder<any, TestClass>()
   //          .name(objectStoreName)
   //          .deserializer(Deserializer.simple(TestClass))
   //          .parameters({autoIncrement: true, keyPath: ['b', 'c']})
   //          .build()
   //    let simpleIndexedDB = new SimpleIndexedDBBuilder()
   //       .name(dbName)
   //       .dbVersion(dbVersion)
   //       .databaseFactory(IndexDB.default)
   //       .objectStores([trueObjectStore])
   //       .build()
   //    simpleIndexedDB.open().then(() => {
   //       let savedObject = new TestClass()
   //       let nested = 'new value'
   //       savedObject.setNested(nested)
   //       trueObjectStore.save(savedObject).then(() => {
   //          trueObjectStore.value({c: nested}).then(loadedObject => {
   //             expect(loadedObject.nested()).toEqual(nested)
   //             simpleIndexedDB.close()
   //             done()
   //          })
   //       })
   //    })
   // })

   it('get all modern', done => {
      dbVersion++
      let objectStoreName = 'getAllModern'
      let trueObjectStore: TrueObjectStore<string, KeyClass> =
         new TrueObjectStoreBuilder<string, KeyClass>()
            .name(objectStoreName)
            .deserializer(Deserializer.simple(KeyClass))
            .parameters({autoIncrement: true, keyPath: '_key'})
            .oldBrowserSupport(false)
            .build()
      let simpleIndexedDB = new SimpleIndexedDBBuilder()
         .name(dbName)
         .dbVersion(dbVersion)
         .databaseFactory(IndexDB.default)
         .objectStores([trueObjectStore])
         .build()
      simpleIndexedDB.open().then(() => {
         let promises: Array<Promise<any>> = []
         promises.push(trueObjectStore.save(new KeyClass('1')))
         promises.push(trueObjectStore.save(new KeyClass('2')))
         promises.push(trueObjectStore.save(new KeyClass('3')))
         promises.push(trueObjectStore.save(new KeyClass('4')))
         Promise.all(promises).then(() => {
            trueObjectStore.all().then(allSaved => {
               expect(allSaved.length).toEqual(4)
               expect(allSaved[0].key).toBeDefined()
               simpleIndexedDB.close()
               done()
            })
         })
      })
   }, 10000)

   it('get all old', done => {
      dbVersion++
      let objectStoreName = 'getAllOld'
      let trueObjectStore: TrueObjectStore<string, KeyClass> =
         new TrueObjectStoreBuilder<string, KeyClass>()
            .name(objectStoreName)
            .deserializer(Deserializer.simple(KeyClass))
            .parameters({autoIncrement: true, keyPath: '_key'})
            .oldBrowserSupport(true)
            .build()
      let simpleIndexedDB = new SimpleIndexedDBBuilder()
         .name(dbName)
         .dbVersion(dbVersion)
         .databaseFactory(IndexDB.default)
         .objectStores([trueObjectStore])
         .build()
      simpleIndexedDB.open().then(() => {
         let promises: Array<Promise<any>> = []
         promises.push(trueObjectStore.save(new KeyClass('1')))
         promises.push(trueObjectStore.save(new KeyClass('2')))
         promises.push(trueObjectStore.save(new KeyClass('3')))
         promises.push(trueObjectStore.save(new KeyClass('4')))
         Promise.all(promises).then(() => {
            trueObjectStore.all().then(allSaved => {
               expect(allSaved.length).toEqual(4)
               expect(allSaved[0].key).toBeDefined()
               simpleIndexedDB.close()
               done()
            })
         })
      })
   }, 10000)

   it('load object with static deserialize method', done => {
      dbVersion++
      let objectStoreName = 'staticDeserialize'
      let trueObjectStore: TrueObjectStore<string, TestClassCustomDeserialize> =
         new TrueObjectStoreBuilder<string, TestClassCustomDeserialize>()
            .name(objectStoreName)
            .type(TestClassCustomDeserialize)
            .parameters({autoIncrement: true, keyPath: 'field'})
            .build()
      let simpleIndexedDB = new SimpleIndexedDBBuilder()
         .name(dbName)
         .databaseFactory(IndexDB.default)
         .dbVersion(dbVersion)
         .objectStores([trueObjectStore])
         .build()
      simpleIndexedDB.open().then(() => {
         let savedObject = new TestClassCustomDeserialize()
         trueObjectStore.save(savedObject).then(() => {
            trueObjectStore.value(savedObject.value()).then(loadedObject => {
               expect(loadedObject.value()).toEqual('deserialized')
               simpleIndexedDB.close()
               done()
            })
         })
      })
   })

   it('load object with deserialize method', done => {
      dbVersion++
      let objectStoreName = 'deserializeMethod'
      let trueObjectStore: TrueObjectStore<string, TestClass> =
         new TrueObjectStoreBuilder<string, TestClass>()
            .name(objectStoreName)
            .deserialize(dataStructure => new Promise(resolve => {
               let testClass = new TestClass()
               testClass.setNested('custom method')
               resolve(testClass)
            }))
            .parameters({autoIncrement: true, keyPath: 'key'})
            .build()
      let simpleIndexedDB = new SimpleIndexedDBBuilder()
         .name(dbName)
         .databaseFactory(IndexDB.default)
         .dbVersion(dbVersion)
         .objectStores([trueObjectStore])
         .build()
      simpleIndexedDB.open().then(() => {
         let savedObject = new TestClass()
         trueObjectStore.save(savedObject).then(() => {
            trueObjectStore.value(savedObject.key).then(loadedObject => {
               expect(loadedObject.nested()).toEqual('custom method')
               simpleIndexedDB.close()
               done()
            })
         })
      })
   })
})
