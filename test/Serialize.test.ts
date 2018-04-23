import { SimpleSerialize } from '../src/serializing/Serialize'

describe('serialize test', () => {
   it('with simple object', () => {
      let testObject = { a: 'first', b: { c: 'nested' } }
      let serialized = SimpleSerialize(testObject)
      expect(serialized.a).toEqual('first')
      expect(serialized.b.c).toEqual('nested')
   })

   it('with serialize function', () => {
      let testObject = { a: 'first', serialize: () => 'custom serialize' }
      let serialized = SimpleSerialize(testObject)
      expect(serialized).toEqual('custom serialize')
   })

   it('with nested serialize function', () => {
      let testObject = {
         a: 'first',
         b: {
            c: { serialize: () => 'nested serialize' },
            d: 'nested'
         }
      }
      let serialized = SimpleSerialize(testObject)
      expect(serialized.a).toEqual('first')
      expect(serialized.b.c).toEqual('nested serialize')
      expect(serialized.b.d).toEqual('nested')
   })
})
