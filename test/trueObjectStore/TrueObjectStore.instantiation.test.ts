import TrueObjectStore from '../../src/TrueObjectStore'
import TrueObjectStoreBuilder from '../../src/TrueObjectStoreBuilder'
import {SimpleSerialize, Deserializer} from '@esentri/de-serializer'


class TestClass {
   public key: string = 'key'
}

describe('TrueObjectStore test instantiation', () => {

   it('instantiation with defaults', () => {
      expect(new TrueObjectStore('test', {keyPath: 'test'},
         Deserializer.simple(String)))
         .toBeInstanceOf(TrueObjectStore)
   })

   it('instantiation completely with builder', () => {
      expect(new TrueObjectStoreBuilder()
         .name('test')
         .parameters({autoIncrement: true, keyPath: 'test'})
         .serialize(SimpleSerialize)
         .deserializer(Deserializer.simple(String))
         .database({} as any)
         .build()).toBeInstanceOf(TrueObjectStore)
   })

   it('is instantiable', () => {
      expect(new TrueObjectStoreBuilder<string, TestClass>()
         .name('test')
         .parameters({autoIncrement: true, keyPath: 'key'})
         .deserializer(Deserializer.simple(TestClass))
         .serialize(SimpleSerialize)
         .build())
         .toBeInstanceOf(TrueObjectStore)
   })

   it('onUpgradeNeeded without database', () => {
      expect(() => new TrueObjectStore('test', {keyPath: 'key'},
         Deserializer.simple(String))
         .onUpgradeNeeded()).toThrow()
   })

   it('without keystore', () => {
      expect(() => {
         new TrueObjectStore('test', {}, Deserializer.simple({}))
      }).toThrow()
   })

   it('without database', done => {
      new TrueObjectStore<String, String>('test', {keyPath: 'test'},
         Deserializer.simple({}))
         .value('hello')
         .catch((value) => {
            done()
         })
   })

   it('with builder but without necessary parameters', () => {
      expect(() => new TrueObjectStoreBuilder().build()).toThrow()
   })

})
