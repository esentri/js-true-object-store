import {Deserializer} from '@esentri/de-serializer'
import {AllStrategy} from './AllStrategy'

export class ModernBrowserAllStrategy<TYPE> implements AllStrategy<TYPE> {

   private deserializer: Deserializer<TYPE>

   constructor(deserializer: Deserializer<TYPE>) {
      this.deserializer = deserializer
   }

   all(objectStore: IDBObjectStore): Promise<Array<TYPE>> {
      return new Promise<Array<TYPE>>((resolve, reject) => {
         let request: IDBRequest = (objectStore as any).getAll()
         request.onsuccess = (event) => {
            resolve(request.result.map((element: any) => {
               this.deserializer.deserialize(element)
            }))
         }
         /* istanbul ignore next */
         request.onerror = (error: any) => reject(error)
      })
   }
}
