"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WarpGatewayContractDefinitionLoader = void 0;
const ContractDefinitionLoader_1 = require("./ContractDefinitionLoader");
const redstone_isomorphic_1 = require("redstone-isomorphic");
const transaction_1 = __importDefault(require("arweave/node/lib/transaction"));
const SmartWeaveTags_1 = require("../../../core/SmartWeaveTags");
const Benchmark_1 = require("../../../logging/Benchmark");
const LoggerFactory_1 = require("../../../logging/LoggerFactory");
const ArweaveWrapper_1 = require("../../../utils/ArweaveWrapper");
const utils_1 = require("../../../utils/utils");
const WasmSrc_1 = require("./wasm/WasmSrc");
const TagsParser_1 = require("./TagsParser");
/**
 * An extension to {@link ContractDefinitionLoader} that makes use of
 * Warp Gateway ({@link https://github.com/redstone-finance/redstone-sw-gateway})
 * to load Contract Data.
 *
 * If the contract data is not available on Warp Gateway - it fallbacks to default implementation
 * in {@link ContractDefinitionLoader} - i.e. loads the definition from Arweave gateway.
 */
class WarpGatewayContractDefinitionLoader {
    constructor(baseUrl, arweave, cache, env) {
        this.baseUrl = baseUrl;
        this.cache = cache;
        this.env = env;
        this.rLogger = LoggerFactory_1.LoggerFactory.INST.create('WarpGatewayContractDefinitionLoader');
        this.baseUrl = (0, utils_1.stripTrailingSlash)(baseUrl);
        this.contractDefinitionLoader = new ContractDefinitionLoader_1.ContractDefinitionLoader(arweave, env);
        this.arweaveWrapper = new ArweaveWrapper_1.ArweaveWrapper(arweave);
        this.tagsParser = new TagsParser_1.TagsParser();
    }
    async load(contractTxId, evolvedSrcTxId) {
        let cacheKey = contractTxId;
        if (evolvedSrcTxId) {
            cacheKey += `_${evolvedSrcTxId}`;
        }
        const cacheResult = await this.cache.get(cacheKey, 'cd');
        if (cacheResult) {
            this.rLogger.debug('WarpGatewayContractDefinitionLoader: Hit from cache!');
            const result = cacheResult.cachedValue;
            // LevelDB serializes Buffer to an object with 'type' and 'data' fields
            if (result.contractType == 'wasm' && result.srcBinary.data) {
                result.srcBinary = redstone_isomorphic_1.Buffer.from(result.srcBinary.data);
            }
            this.verifyEnv(result);
            return result;
        }
        const benchmark = Benchmark_1.Benchmark.measure();
        const contract = await this.doLoad(contractTxId, evolvedSrcTxId);
        this.rLogger.info(`Contract definition loaded in: ${benchmark.elapsed()}`);
        this.verifyEnv(contract);
        await this.cache.put({ contractTxId: cacheKey, sortKey: 'cd' }, contract);
        return contract;
    }
    async doLoad(contractTxId, forcedSrcTxId) {
        try {
            const result = await fetch(`${this.baseUrl}/gateway/contract?txId=${contractTxId}${forcedSrcTxId ? `&srcTxId=${forcedSrcTxId}` : ''}`)
                .then((res) => {
                return res.ok ? res.json() : Promise.reject(res);
            })
                .catch((error) => {
                var _a, _b;
                if ((_a = error.body) === null || _a === void 0 ? void 0 : _a.message) {
                    this.rLogger.error(error.body.message);
                }
                throw new Error(`Unable to retrieve contract data. Warp gateway responded with status ${error.status}:${(_b = error.body) === null || _b === void 0 ? void 0 : _b.message}`);
            });
            if (result.srcBinary != null && !(result.srcBinary instanceof redstone_isomorphic_1.Buffer)) {
                result.srcBinary = redstone_isomorphic_1.Buffer.from(result.srcBinary.data);
            }
            if (result.srcBinary) {
                const wasmSrc = new WasmSrc_1.WasmSrc(result.srcBinary);
                result.srcBinary = wasmSrc.wasmBinary();
                let sourceTx;
                if (result.srcTx) {
                    sourceTx = new transaction_1.default({ ...result.srcTx });
                }
                else {
                    sourceTx = await this.arweaveWrapper.tx(result.srcTxId);
                }
                const srcMetaData = JSON.parse(this.tagsParser.getTag(sourceTx, SmartWeaveTags_1.SmartWeaveTags.WASM_META));
                result.metadata = srcMetaData;
            }
            result.contractType = result.src ? 'js' : 'wasm';
            return result;
        }
        catch (e) {
            this.rLogger.warn('Falling back to default contracts loader', e);
            return await this.contractDefinitionLoader.doLoad(contractTxId, forcedSrcTxId);
        }
    }
    async loadContractSource(contractSrcTxId) {
        return await this.contractDefinitionLoader.loadContractSource(contractSrcTxId);
    }
    type() {
        return 'warp';
    }
    setCache(cache) {
        this.cache = cache;
    }
    getCache() {
        return this.cache;
    }
    verifyEnv(def) {
        if (def.testnet && this.env !== 'testnet') {
            throw new Error('Trying to use testnet contract in a non-testnet env. Use the "forTestnet" factory method.');
        }
        if (!def.testnet && this.env === 'testnet') {
            throw new Error('Trying to use non-testnet contract in a testnet env.');
        }
    }
}
exports.WarpGatewayContractDefinitionLoader = WarpGatewayContractDefinitionLoader;
//# sourceMappingURL=WarpGatewayContractDefinitionLoader.js.map