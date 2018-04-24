import {Deserializer} from '@esentri/de-serializer'
import {AllStrategy} from './AllStrategy'

export class AutomaticAllStrategy<TYPE> implements AllStrategy<TYPE> {

   private deserializer: Deserializer<TYPE>

   constructor(deserializer: Deserializer<TYPE>) {
      this.deserializer = deserializer
   }

   all(objectStore: IDBObjectStore): Promise<Array<TYPE>> {
      if ('getAll' in objectStore)
         return AllStrategy.modernBrowsers<TYPE>(this.deserializer).all(objectStore)
      return AllStrategy.oldBrowsers<TYPE>(this.deserializer).all(objectStore)
   }
}
