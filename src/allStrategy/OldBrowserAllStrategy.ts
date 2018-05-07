import {Deserializer} from '@esentri/de-serializer'
import {AllStrategy} from './AllStrategy'

export class OldBrowserAllStrategy<TYPE> implements AllStrategy<TYPE> {

   private deserializer: Deserializer<TYPE>

   constructor(deserializer: Deserializer<TYPE>) {
      this.deserializer = deserializer
   }

   all(objectStore: IDBObjectStore): Promise<Array<TYPE>> {
      return new Promise<Array<TYPE>>((resolve, reject) => {
         let idbRequest = objectStore.openCursor()
         let all: Array<Promise<TYPE>> = []
         idbRequest.onsuccess = (event: any) => {
            let cursor = event.target.result
            if (cursor) {
               all.push(this.deserializer.deserialize(cursor.value))
               cursor.continue()
               return
            }
            resolve(Promise.all(all))
         }
         /* istanbul ignore next */
         idbRequest.onerror = (error: any) => reject(error)
      })
   }
}
