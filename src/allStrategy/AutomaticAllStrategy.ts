import Deserializer from '../serializing/Deserializer'
import AllStrategy from './AllStrategy'

export default class AutomaticAllStrategy<TYPE> implements AllStrategy<TYPE> {

   private deserializer: Deserializer<TYPE>

   constructor(deserializer: Deserializer<TYPE>) {
      this.deserializer = deserializer
   }

   all(objectStore: IDBObjectStore): Promise<Array<TYPE>> {
      if ('getAll' in objectStore)
         return AllStrategy.modernBrowsers(this.deserializer).all(objectStore)
      return AllStrategy.oldBrowsers(this.deserializer).all(objectStore)
   }
}
