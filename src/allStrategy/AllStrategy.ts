import {Deserializer} from '@esentri/de-serializer'
import OldBrowserAllStrategy from './OldBrowserAllStrategy'
import ModernBrowserAllStrategy from './ModernBrowserAllStrategy'
import AutomaticAllStrategy from './AutomaticAllStrategy'

export default abstract class AllStrategy<TYPE> {
   abstract all(objectStore: IDBObjectStore): Promise<Array<TYPE>>

   public static oldBrowsers<TYPE>(deserializer: Deserializer<TYPE>): AllStrategy<TYPE> {
      return new OldBrowserAllStrategy(deserializer)
   }

   public static modernBrowsers<TYPE>(deserializer: Deserializer<TYPE>): AllStrategy<TYPE> {
      return new ModernBrowserAllStrategy(deserializer)
   }

   public static automatic<TYPE>(deserializer: Deserializer<TYPE>): AllStrategy<TYPE> {
      return new AutomaticAllStrategy(deserializer)
   }

}
