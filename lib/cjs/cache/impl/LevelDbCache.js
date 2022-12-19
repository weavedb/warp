"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LevelDbCache = void 0;
const level_1 = require("level");
const memory_level_1 = require("memory-level");
const LoggerFactory_1 = require("../../logging/LoggerFactory");
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
class LevelDbCache {
    // Lazy initialization upon first access
    get db() {
        if (!this._db) {
            if (this.cacheOptions.inMemory) {
                this._db = new memory_level_1.MemoryLevel({ valueEncoding: 'json' });
            }
            else {
                if (!this.cacheOptions.dbLocation) {
                    throw new Error('LevelDb cache configuration error - no db location specified');
                }
                const dbLocation = this.cacheOptions.dbLocation;
                this.logger.info(`Using location ${dbLocation}`);
                this._db = new level_1.Level(dbLocation, { valueEncoding: 'json' });
            }
        }
        return this._db;
    }
    constructor(cacheOptions) {
        this.cacheOptions = cacheOptions;
        this.logger = LoggerFactory_1.LoggerFactory.INST.create('LevelDbCache');
    }
    async get(contractTxId, sortKey, returnDeepCopy) {
        const contractCache = this.db.sublevel(contractTxId, { valueEncoding: 'json' });
        // manually opening to fix https://github.com/Level/level/issues/221
        await contractCache.open();
        try {
            const result = await contractCache.get(sortKey);
            return {
                sortKey: sortKey,
                cachedValue: result
            };
        }
        catch (e) {
            if (e.code == 'LEVEL_NOT_FOUND') {
                return null;
            }
            else {
                throw e;
            }
        }
    }
    async getLast(contractTxId) {
        const contractCache = this.db.sublevel(contractTxId, { valueEncoding: 'json' });
        // manually opening to fix https://github.com/Level/level/issues/221
        await contractCache.open();
        const keys = await contractCache.keys({ reverse: true, limit: 1 }).all();
        if (keys.length) {
            return {
                sortKey: keys[0],
                cachedValue: await contractCache.get(keys[0])
            };
        }
        else {
            return null;
        }
    }
    async getLessOrEqual(contractTxId, sortKey) {
        const contractCache = this.db.sublevel(contractTxId, { valueEncoding: 'json' });
        // manually opening to fix https://github.com/Level/level/issues/221
        await contractCache.open();
        const keys = await contractCache.keys({ reverse: true, lte: sortKey, limit: 1 }).all();
        if (keys.length) {
            return {
                sortKey: keys[0],
                cachedValue: await contractCache.get(keys[0])
            };
        }
        else {
            return null;
        }
    }
    async put(stateCacheKey, value) {
        const contractCache = this.db.sublevel(stateCacheKey.contractTxId, { valueEncoding: 'json' });
        // manually opening to fix https://github.com/Level/level/issues/221
        await contractCache.open();
        await contractCache.put(stateCacheKey.sortKey, value);
    }
    async delete(contractTxId) {
        const contractCache = this.db.sublevel(contractTxId, { valueEncoding: 'json' });
        await contractCache.open();
        await contractCache.clear();
    }
    close() {
        return this.db.close();
    }
    async dump() {
        const result = await this.db.iterator().all();
        return result;
    }
    // TODO: this implementation is sub-optimal
    // the lastSortKey should be probably memoized during "put"
    async getLastSortKey() {
        let lastSortKey = '';
        await this.db.open();
        const keys = await this.db.keys().all();
        for (const key of keys) {
            // default key format used by sub-levels:
            // !<contract_tx_id (43 chars)>!<sort_key>
            const sortKey = key.substring(45);
            if (sortKey.localeCompare(lastSortKey) > 0) {
                lastSortKey = sortKey;
            }
        }
        return lastSortKey == '' ? null : lastSortKey;
    }
    async allContracts() {
        await this.db.open();
        const keys = await this.db.keys().all();
        const result = new Set();
        keys.forEach((k) => result.add(k.substring(1, 44)));
        return Array.from(result);
    }
    storage() {
        return this.db;
    }
    async getNumEntries() {
        const keys = await this.db.keys().all();
        return keys.length;
    }
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
    async prune(entriesStored = 5) {
        if (!entriesStored || entriesStored <= 0) {
            entriesStored = 1;
        }
        const contracts = await this.allContracts();
        for (let i = 0; i < contracts.length; i++) {
            const contractCache = this.db.sublevel(contracts[i], { valueEncoding: 'json' });
            // manually opening to fix https://github.com/Level/level/issues/221
            await contractCache.open();
            // Get keys that will be left, just to get the last one of them
            const entries = await contractCache.keys({ reverse: true, limit: entriesStored }).all();
            if (!entries || entries.length < entriesStored) {
                continue;
            }
            await contractCache.clear({ lt: entries[entries.length - 1] });
            await contractCache.close();
        }
        return null;
    }
}
exports.LevelDbCache = LevelDbCache;
//# sourceMappingURL=LevelDbCache.js.map