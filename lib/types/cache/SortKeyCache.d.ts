/**
 * A cache that stores its values per contract tx id and sort key.
 * A sort key is a value that the SmartWeave protocol is using
 * to sort contract transactions ({@link LexicographicalInteractionsSorter}.
 *
 * All values should be stored in a lexicographical order (per contract) -
 * sorted by the sort key.
 */
export interface SortKeyCache<V> {
    getLessOrEqual(key: string, sortKey: string): Promise<SortKeyCacheResult<V> | null>;
    /**
     * returns latest value stored for given contractTxId
     */
    getLast(contractTxId: string): Promise<SortKeyCacheResult<V> | null>;
    /**
     * returns last cached sort key - takes all contracts into account
     */
    getLastSortKey(): Promise<string | null>;
    /**
     * returns value for the key and exact blockHeight
     */
    get(contractTxId: string, sortKey: string, returnDeepCopy?: boolean): Promise<SortKeyCacheResult<V> | null>;
    /**
     * puts new value in cache under given {@link CacheKey.key} and {@link CacheKey.blockHeight}.
     */
    put(cacheKey: CacheKey, value: V): Promise<void>;
    /**
     * removes contract's data
     */
    delete(contractTxId: string): Promise<void>;
    close(): Promise<void>;
    /**
     * used mostly for debugging, allows to dump the current content cache
     * It's slow.
     */
    dump(): Promise<any>;
    /**
     * Return all cached contracts.
     */
    allContracts(): Promise<string[]>;
    /**
     * returns underlying storage (LevelDB, LMDB, sqlite...)
     * - useful for performing low-level operations
     */
    storage<S>(): S;
    /**
     * leaves n-latest (i.e. with latest (in lexicographic order) sort keys)
     * entries for each cached contract
     *
     * @param entriesStored - how many latest entries should be left
     * for each cached contract
     *
     * @retun PruneStats if getting them doesn't introduce a delay, null otherwise
     */
    prune(entriesStored: number): Promise<PruneStats | null>;
}
export interface PruneStats {
    entriesBefore: number;
    entriesAfter: number;
    sizeBefore: number;
    sizeAfter: number;
}
export declare class CacheKey {
    readonly contractTxId: string;
    readonly sortKey: string;
    constructor(contractTxId: string, sortKey: string);
}
export declare class SortKeyCacheResult<V> {
    readonly sortKey: string;
    readonly cachedValue: V;
    constructor(sortKey: string, cachedValue: V);
}
//# sourceMappingURL=SortKeyCache.d.ts.map