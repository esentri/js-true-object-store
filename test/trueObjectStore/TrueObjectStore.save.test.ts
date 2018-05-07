import * as IndexDB from 'fake-indexeddb'
import {TrueObjectStore} from '../../src/TrueObjectStore'
import {TrueObjectStoreBuilder} from '../../src/TrueObjectStoreBuilder'
import {Deserializer} from '@esentri/de-serializer'
import {SimpleIndexedDBBuilder} from '../../src/SimpleIndexedDBBuilder'

class TestClass {
   public key: string = 'key'
   public a: string = 'first'
   public b: any = {
      c: 'nested'
   }

   public setNested(nested: string) {
      this.b.c = nested
   }

   public nested() {
      return this.b.c
   }
}

class TestClassCustomDeserialize {
   private field: string = 'init'

   public value(): string {
      return this.field
   }

   public static deserialize(dataStructure: any): Promise<TestClassCustomDeserialize> {
      return new Promise(resolve => {
         let deserialized = new TestClassCustomDeserialize()
         deserialized.field = 'deserialized'
         resolve(deserialized)
      })
   }
}

describe('TrueObjectStore test saving', () => {

   it('simple save test', done => {
      let objectStoreName = 'test'
      let dbName = 'db1'
      let trueObjectStore: TrueObjectStore<string, TestClass> =
         new TrueObjectStoreBuilder<string, TestClass>()
            .name(objectStoreName)
            .deserializer(Deserializer.simple(TestClass))
            .parameters({autoIncrement: true, keyPath: 'key'})
            .build()
      new SimpleIndexedDBBuilder()
         .name(dbName)
         .databaseFactory(IndexDB.default)
         .objectStores([trueObjectStore])
         .build()
         .open()
         .then(() => {
            trueObjectStore.save(new TestClass()).then(() => {
               IndexDB.default.open(dbName).onsuccess = (event: any) => {
                  let database: IDBDatabase = event.target.result
                  let storedObjectRequest = database
                     .transaction(objectStoreName, 'readonly')
                     .objectStore(objectStoreName)
                     .get('key')
                  storedObjectRequest.onsuccess = (event: any) => {
                     expect(new TestClass().a).toEqual(event.target.result.a)
                     expect(event.target.result.a).toEqual('first')
                     expect(event.target.result.b.c).toEqual('nested')
                     database.close()
                     done()
                  }
               }
            })
         })
   })

})
