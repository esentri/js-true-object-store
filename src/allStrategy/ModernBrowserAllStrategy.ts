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
            let deserializePromises: Array<Promise<TYPE>> = []
            request.result.forEach((element: any) => {
               deserializePromises.push(this.deserializer.deserialize(element))
            })
            resolve(Promise.all(deserializePromises))
         }
         /* istanbul ignore next */
         request.onerror = (error: any) => reject(error)
      })
   }
}
