import * as IndexDB from 'fake-indexeddb'
import {TrueObjectStore} from '../src/TrueObjectStore'
import {SimpleIndexedDBBuilder} from '../src/SimpleIndexedDBBuilder'
import {AllStrategy} from '../src/allStrategy/AllStrategy'
import {SimpleSerialize, Deserializer} from '@esentri/de-serializer'

class KeyClass {
   private _key: string

   constructor(key: string) {
      this._key = key;
   }

   get key() {
      return this._key
   }
}

describe('AutomaticAllStrategy', () => {

   let dbVersion = 0
   let dbName = 'AutomaticAllStrategyDB'

   it('modern', done => {
      dbVersion++
      let objectStoreName = 'getAllModern'
      let trueObjectStore: TrueObjectStore<string, KeyClass> =
         new TrueObjectStore<string, KeyClass>(objectStoreName, {keyPath: '_key'},
            Deserializer.simple(KeyClass), SimpleSerialize, undefined,
            AllStrategy.automatic(Deserializer.simple(KeyClass)))
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

   it('old', done => {
      dbVersion++
      let objectStoreName = 'getAllOld'
      let trueObjectStore: TrueObjectStore<string, KeyClass> =
         new TrueObjectStore<string, KeyClass>(objectStoreName, {keyPath: '_key'},
            Deserializer.simple(KeyClass))
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
            IndexDB.default.open(dbName).onsuccess = (event: any) => {
               let database: IDBDatabase = event.target.result
               let idbObjectStore: any = database
                  .transaction(objectStoreName, 'readonly')
                  .objectStore(objectStoreName)
               delete Object.getPrototypeOf(idbObjectStore)['getAll']
               AllStrategy.automatic(Deserializer.simple(KeyClass)).all(idbObjectStore)
                  .then((allSaved: any) => {
                     expect(allSaved.length).toEqual(4)
                     expect(allSaved[0].key).toBeDefined()
                     done()
                  })
            }
         })
      })
   }, 10000)
})
