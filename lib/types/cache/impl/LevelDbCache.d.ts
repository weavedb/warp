import { SortKeyCache, CacheKey, SortKeyCacheResult } from '../SortKeyCache';
import { CacheOptions } from '../../core/WarpFactory';
/**
 * The LevelDB is a lexicographically sorted key-value database - so it's ideal for this use case
 * - as it simplifies cache look-ups (e.g. lastly stored value or value "lower-or-equal" than given sortKey).
 * The cache for contracts are implemented as sub-levels - https://www.npmjs.com/package/level#sublevel--dbsublevelname-options.
 *
 * The default location for the node.js cache is ./cache/warp.
 * The default name for the browser IndexedDB cache is warp-cache
 *
 * In order to reduce the cache size, the oldest entries are automatically pruned.
 */
export declare class LevelDbCache<V = any> implements SortKeyCache<V> {
    private readonly cacheOptions;
    private readonly logger;
    /**
     * not using the Level type, as it is not compatible with MemoryLevel (i.e. has more properties)
     * and there doesn't seem to be any public interface/abstract type for all Level implementations
     * (the AbstractLevel is not exported from the package...)
     */
    private _db;
    private get db();
    constructor(cacheOptions: CacheOptions);
    get(contractTxId: string, sortKey: string, returnDeepCopy?: boolean): Promise<SortKeyCacheResult<V> | null>;
    getLast(contractTxId: string): Promise<SortKeyCacheResult<V> | null>;
    getLessOrEqual(contractTxId: string, sortKey: string): Promise<SortKeyCacheResult<V> | null>;
    put(stateCacheKey: CacheKey, value: V): Promise<void>;
    delete(contractTxId: string): Promise<void>;
    close(): Promise<void>;
    dump(): Promise<any>;
    getLastSortKey(): Promise<string | null>;
    allContracts(): Promise<string[]>;
    storage<S>(): S;
    getNumEntries(): Promise<number>;
    /**
     Let's assume that given contract cache contains these sortKeys: [a, b, c, d, e, f]
     Let's assume entriesStored = 2
     After pruning, the cache should be left with these keys: [e,f].
  
     const entries = await contractCache.keys({ reverse: true, limit: entriesStored }).all();
     This would return in this case entries [f, e] (notice the "reverse: true").
  
     await contractCache.clear({ lt: entries[entries.length - 1] });
     This effectively means: await contractCache.clear({ lt: e });
     -> hence the entries [a,b,c,d] are removed and left are the [e,f]
    */
    prune(entriesStored?: number): Promise<null>;
}
//# sourceMappingURL=LevelDbCache.d.ts.map