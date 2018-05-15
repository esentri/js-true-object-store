import {Serialize, SimpleSerialize, Deserializer, Deserialize} from '@esentri/de-serializer'
import {TrueObjectStore} from './TrueObjectStore'
import {AllStrategy} from './allStrategy/AllStrategy'

export class TrueObjectStoreBuilder<KEY, TYPE> {
   private _name?: string
   private _database?: IDBDatabase
   private _deserializer?: Deserializer<TYPE>
   private _parameters?: IDBObjectStoreParameters
   private _serialize: Serialize = SimpleSerialize
   private _oldBrowserSupport = false
   private _type?: any = null

   database (database: IDBDatabase): TrueObjectStoreBuilder<KEY, TYPE> {
      this._database = database
      return this
   }

   name (value: string): TrueObjectStoreBuilder<KEY, TYPE> {
      this._name = value
      return this
   }

   parameters (value: IDBObjectStoreParameters): TrueObjectStoreBuilder<KEY, TYPE> {
      this._parameters = value
      return this
   }

   serialize (value: Serialize): TrueObjectStoreBuilder<KEY, TYPE> {
      this._serialize = value
      return this
   }

   deserialize (value: Deserialize<TYPE>): TrueObjectStoreBuilder<KEY, TYPE> {
      this._deserializer = {
         deserialize: value as any
      }
      return this
   }

   deserializer (value: Deserializer<TYPE>): TrueObjectStoreBuilder<KEY, TYPE> {
      this._deserializer = value
      return this
   }

   type (value: any): TrueObjectStoreBuilder<KEY, TYPE> {
      this._type = value
      return this
   }

   oldBrowserSupport (support: boolean): TrueObjectStoreBuilder<KEY, TYPE> {
      this._oldBrowserSupport = support
      return this
   }

   build (): TrueObjectStore<KEY, TYPE> {
      this.checkParameters()
      return new TrueObjectStore<KEY, TYPE>(
         this._name!,
         this._parameters!,
         this._deserializer || Deserializer.simple(this._type),
         this._serialize,
         this._database,
         this.allStrategy()
      )
   }

   private allStrategy (): AllStrategy<TYPE> {
      if (this._oldBrowserSupport) return AllStrategy.oldBrowsers(this._deserializer!)
      return AllStrategy.modernBrowsers(this._deserializer!)
   }

   private checkParameters () {
      if (!this._name || !this._parameters || (!this._deserializer && !this._type))
         throw new Error('You missed to pass a required value: name[' + this._name + '] ' +
            'parameters[' + this._parameters + '] deserializer[' + this._deserializer + '] ' +
            'type[' + this._type + ']')
      if (!this._deserializer && !this._type['deserialize']) {
         throw new Error('You neither gave a deserializer nor a type with a static ' +
            'deserialize method')
      }
   }
}
