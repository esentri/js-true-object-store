import {TrueObjectStore} from './TrueObjectStore'

export class SimpleIndexedDB {
   private database?: IDBDatabase
   private name: string
   private dbVersion: number
   private databaseFactory: IDBFactory
   private objectStores: Array<TrueObjectStore<any, any>>

   constructor(name: string,
               dbVersion: number = 1,
               databaseFactory: IDBFactory = window.indexedDB,
               objectStores: Array<TrueObjectStore<any, any>> = []) {
      this.name = name
      this.dbVersion = dbVersion
      this.databaseFactory = databaseFactory
      this.objectStores = objectStores
   }

   public open(): Promise<void> {
      return new Promise<void> ((resolve, reject) => {
         let idbOpenDBRequest = this.databaseFactory.open(this.name, this.dbVersion)
         idbOpenDBRequest.onerror = this.onCreationError(reject)
         idbOpenDBRequest.onupgradeneeded = this.onUpgradeNeededAfterCreation()
         idbOpenDBRequest.onsuccess = this.onCreationSuccess(resolve)
      })
   }

   public close() {
      if(!this.database)
         throw new Error('You tried to close a non existing DB: ' + this.name)
      this.database.close()
   }

   private onCreationError(reject: any) {
      /* istanbul ignore next */
      return (event: any) => {
         console.error('Opening IndexedDB failed: ', event)
         reject()
      }
   }

   private onUpgradeNeededAfterCreation() {
      return (event: any) => {
         let database = event.target.result
         this.objectStores.forEach(store => {
            store.onUpgradeNeeded(database)
         })
      }
   }

   private onCreationSuccess(resolve: any) {
      return (event: any) => {
         this.database = event.target.result
         this.database!.onerror = this.dbGlobalErrorHandler
         this.objectStores.forEach(store => {
            store.__database(this.database!)
         })
         resolve()
      }
   }

   /* istanbul ignore next */
   private dbGlobalErrorHandler(error: any) {
      console.error('An error happened using SimpleIndexedDB: ', error)
   }
}
