import { isPrimitive } from 'util'

export default interface Deserialize<T> {
   (dataStructure: any, Class: any): T
}

export var SimpleDeserialize: Deserialize<any> = (dataStructure: any, Class: any): any => {
   if (Class['deserialize']) return Class.deserialize(dataStructure)
   let deserialized = new Class()
   Object.keys(dataStructure).forEach(property => {
      if (isPrimitive(deserialized[property])) {
         deserialized[property] = dataStructure[property]
         return
      }
      deserialized[property] = SimpleDeserialize(
         dataStructure[property],
         deserialized[property].constructor
      )
   })
   return deserialized
}
