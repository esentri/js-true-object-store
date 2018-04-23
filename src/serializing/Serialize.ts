import { isPrimitive } from 'util'

export default interface Serialize {
   (element: any): any
}

export var SimpleSerialize: Serialize = (element: any): any => {
   if (element['serialize']) return element.serialize()
   if (isPrimitive(element)) return element
   let serialized: any = {}
   Object.keys(element).forEach(property => {
      serialized[property] = SimpleSerialize(element[property])
   })
   return serialized
}
