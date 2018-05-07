import {Serialize, SimpleSerialize, Deserializer} from '@esentri/de-serializer'
import {isPrimitive} from 'util'
import {AllStrategy} from './allStrategy/AllStrategy'

export class TrueObjectStore<KEY, TYPE> {
   private name: string
   private database?: IDBDatabase
   private parameters: IDBObjectStoreParameters
   private serialize: Serialize
   private deserializer: Deserializer<TYPE>
   private allStrategy: AllStrategy<TYPE>

   constructor(name: string,
               parameters: IDBObjectStoreParameters,
               deserializer: Deserializer<TYPE>,
               serialize: Serialize = SimpleSerialize,
               database?: IDBDatabase,
               allStrategy: AllStrategy<TYPE> = AllStrategy.oldBrowsers(deserializer)) {
      if (!parameters.keyPath)
         throw new Error('no key path added')
      this.name = name
      this.parameters = parameters
      this.serialize = serialize
      this.deserializer = deserializer
      this.database = database
      this.allStrategy = allStrategy
   }

   __database(database: IDBDatabase) {
      this.database = database
   }

   public onUpgradeNeeded(databaseInput?: IDBDatabase) {
      let database = databaseInput ? databaseInput : this.database
      if (!database)
         throw new Error('No database for onUpgradeNeeded for store ' + this.name)
      database.createObjectStore(this.name, this.parameters)
   }

   public save(element: TYPE): Promise<void> {
      return new Promise<void>((resolve, reject) => {
         this.serialize(element).then(serialized => {
            let idbRequest = this.objectStoreReadWrite().put(serialized)
            idbRequest.onsuccess = () => resolve()
            /* istanbul ignore next */
            idbRequest.onerror = error => reject(error)
         })
      })
   }

   public value(key: KEY): Promise<TYPE> {
      return new Promise<TYPE>((resolve, reject) => {
         let readRequest = this.objectStoreReadOnly().get(this.idFromKey(key))
         readRequest.onsuccess = (event: any) => {
            this.deserializer.deserialize(event.target.result).then(deserialized => {
               resolve(deserialized)
            })
         }
         /* istanbul ignore next */
         readRequest.onerror = error => reject(error)
      })
   }

   private idFromKey(key: KEY): any {
      if (isPrimitive(key)) return key
      let id: any = key
      this.keyPathArray(this.parameters.keyPath!).forEach(
         (pathPart: string, index: number) => {
            if (index == 0) return
            id = id[pathPart]
         })
      return id
   }

   private keyPathArray(keyPath: string | string[]): Array<string> {
      if (Array.isArray(keyPath)) return keyPath
      return keyPath.split('.')
   }

   public all(): Promise<Array<TYPE>> {
      this.databaseExists()
      return this.allStrategy.all(this.objectStoreReadOnly())
   }

   private objectStoreReadWrite(): IDBObjectStore {
      this.databaseExists()
      return this.database!.transaction(this.name, 'readwrite').objectStore(this.name)
   }

   private objectStoreReadOnly(): IDBObjectStore {
      this.databaseExists()
      return this.database!.transaction(this.name, 'readonly').objectStore(this.name)
   }

   private databaseExists() {
      if (!this.database)
         throw new Error('No database set for object store: ' + this.name)
   }
}
