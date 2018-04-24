import TrueObjectStore from './TrueObjectStore'
import SimpleIndexedDB from './SimpleIndexedDB'

export default class SimpleIndexedDBBuilder {
   private _name?: string
   private _dbVersion?: number
   private _databaseFactory: IDBFactory = window.indexedDB
   private _objectStores?: Array<TrueObjectStore<any, any>>

   public name(name: string): SimpleIndexedDBBuilder {
      this._name = name
      return this
   }

   public dbVersion(version: number): SimpleIndexedDBBuilder {
      this._dbVersion = version
      return this
   }

   public databaseFactory(databaseFactory: IDBFactory): SimpleIndexedDBBuilder {
      this._databaseFactory = databaseFactory
      return this
   }

   public objectStores(objectStores: Array<TrueObjectStore<any, any>>) {
      this._objectStores = objectStores
      return this
   }

   public build(): SimpleIndexedDB {
      return new SimpleIndexedDB(this._name!,
         this._dbVersion,
         this._databaseFactory,
         this._objectStores)
   }

}
