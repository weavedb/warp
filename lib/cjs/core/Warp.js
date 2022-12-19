"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Warp = void 0;
const DefaultCreateContract_1 = require("../contract/deploy/impl/DefaultCreateContract");
const HandlerBasedContract_1 = require("../contract/HandlerBasedContract");
const PstContractImpl_1 = require("../contract/PstContractImpl");
const Testing_1 = require("../contract/testing/Testing");
const WarpBuilder_1 = require("./WarpBuilder");
const WarpPlugin_1 = require("./WarpPlugin");
/**
 * The Warp "motherboard" ;-).
 * This is the base class that supplies the implementation of the SmartWeave protocol
 * Allows to plug-in different implementation of all the modules defined in the constructor.
 *
 * After being fully configured, it allows to "connect" to
 * contract and perform operations on them (see {@link Contract})
 */
class Warp {
    constructor(arweave, definitionLoader, interactionsLoader, executorFactory, stateEvaluator, environment = 'custom') {
        this.arweave = arweave;
        this.definitionLoader = definitionLoader;
        this.interactionsLoader = interactionsLoader;
        this.executorFactory = executorFactory;
        this.stateEvaluator = stateEvaluator;
        this.environment = environment;
        this.plugins = new Map();
        this.createContract = new DefaultCreateContract_1.DefaultCreateContract(arweave, this);
        this.testing = new Testing_1.Testing(arweave);
    }
    static builder(arweave, stateCache, environment) {
        return new WarpBuilder_1.WarpBuilder(arweave, stateCache, environment);
    }
    /**
     * Allows to connect to any contract using its transaction id.
     * @param contractTxId
     * @param callingContract
     */
    contract(contractTxId, callingContract, innerCallData) {
        return new HandlerBasedContract_1.HandlerBasedContract(contractTxId, this, callingContract, innerCallData);
    }
    async deploy(contractData, disableBundling) {
        return await this.createContract.deploy(contractData, disableBundling);
    }
    async deployFromSourceTx(contractData, disableBundling) {
        return await this.createContract.deployFromSourceTx(contractData, disableBundling);
    }
    async deployBundled(rawDataItem) {
        return await this.createContract.deployBundled(rawDataItem);
    }
    async createSourceTx(sourceData, wallet) {
        return await this.createContract.createSourceTx(sourceData, wallet);
    }
    async saveSourceTx(srcTx, disableBundling) {
        return await this.createContract.saveSourceTx(srcTx, disableBundling);
    }
    /**
     * Allows to connect to a contract that conforms to the Profit Sharing Token standard
     * @param contractTxId
     */
    pst(contractTxId) {
        return new PstContractImpl_1.PstContractImpl(contractTxId, this);
    }
    useStateCache(stateCache) {
        this.stateEvaluator.setCache(stateCache);
        return this;
    }
    useContractCache(contractsCache) {
        this.definitionLoader.setCache(contractsCache);
        return this;
    }
    use(plugin) {
        const pluginType = plugin.type();
        if (!WarpPlugin_1.knownWarpPlugins.some((p) => p == pluginType)) {
            throw new Error(`Unknown plugin type ${pluginType}.`);
        }
        this.plugins.set(pluginType, plugin);
        return this;
    }
    hasPlugin(type) {
        return this.plugins.has(type);
    }
    loadPlugin(type) {
        if (!this.hasPlugin(type)) {
            throw new Error(`Plugin ${type} not registered.`);
        }
        return this.plugins.get(type);
    }
    async generateWallet() {
        const wallet = await this.arweave.wallets.generate();
        if (await this.testing.isArlocal()) {
            await this.testing.addFunds(wallet);
        }
        return {
            jwk: wallet,
            address: await this.arweave.wallets.jwkToAddress(wallet)
        };
    }
}
exports.Warp = Warp;
//# sourceMappingURL=Warp.js.map