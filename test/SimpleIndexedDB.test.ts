import * as IndexDB from 'fake-indexeddb'
import {SimpleIndexedDBBuilder} from '../src/SimpleIndexedDBBuilder'
import {SimpleIndexedDB} from '../src/SimpleIndexedDB'
import {TrueObjectStoreBuilder} from '../src/TrueObjectStoreBuilder'
import {Deserializer} from '@esentri/de-serializer'

describe('SimpleIndexedDB Test', () => {

   it('instantiation with defaults', () => {
      let simpleIndexedDB = new SimpleIndexedDB('hello')
      expect(simpleIndexedDB).toBeInstanceOf(SimpleIndexedDB)
   })

   it('instantiation', () => {
      let simpleIndexedDB = new SimpleIndexedDBBuilder()
         .name('testDB1')
         .dbVersion(1)
         .databaseFactory(IndexDB.default)
         .objectStores([])
         .build()
      expect(simpleIndexedDB).toBeInstanceOf(SimpleIndexedDB)
   })

   it('open', done => {
      new SimpleIndexedDBBuilder()
         .name('testDB2')
         .dbVersion(1)
         .databaseFactory(IndexDB.default)
         .objectStores([])
         .build()
         .open()
         .then(() => done())
   })

   it('close', done => {
      let simpleIndexedDB = new SimpleIndexedDBBuilder()
         .name('testDB3')
         .dbVersion(1)
         .databaseFactory(IndexDB.default)
         .objectStores([])
         .build()
      simpleIndexedDB.open().then(() => {
         simpleIndexedDB.close()
         done()
      })
   })

   it('close without open', () => {
      let simpleIndexedDB = new SimpleIndexedDBBuilder()
         .name('testDB4')
         .dbVersion(1)
         .databaseFactory(IndexDB.default)
         .objectStores([])
         .build()
      expect(() => simpleIndexedDB.close()).toThrow()
   })

   it('open with object stores', done => {
      let objectStore = new TrueObjectStoreBuilder()
         .name('store')
         .deserializer(Deserializer.simple(String))
         .parameters({keyPath: 'test'})
         .build()
      let simpleIndexedDB = new SimpleIndexedDBBuilder()
         .name('testDB5')
         .dbVersion(1)
         .databaseFactory(IndexDB.default)
         .objectStores([objectStore])
         .build()
      simpleIndexedDB.open().then(() => {
         expect(objectStore['database']).toBeDefined()
         done()
      })
   })

   it('version is zero', done => {
      let simpleIndexedDB = new SimpleIndexedDBBuilder()
         .name('testDB6')
         .dbVersion(0)
         .databaseFactory(IndexDB.default)
         .objectStores([])
         .build()
      simpleIndexedDB.open().catch((error: any) => {
         done()
      })
   })


})
