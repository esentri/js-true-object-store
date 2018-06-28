import {TrueObjectStore} from '../../src/TrueObjectStore'
import {TrueObjectStoreBuilder} from '../../src/TrueObjectStoreBuilder'
import {SimpleSerialize, Deserializer} from '@esentri/de-serializer'


describe('TrueObjectStore test clear', () => {

   it('without database', done => {
      new TrueObjectStore<String, String>('test', {keyPath: 'test'},
         Deserializer.simple({}))
         .clear()
         .catch(_ => {
            done()
         })
   })

})
