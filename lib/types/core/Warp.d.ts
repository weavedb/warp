/// <reference types="node" />
import Arweave from 'arweave';
import { Contract, InnerCallData } from '../contract/Contract';
import { ArWallet, ContractData, ContractDeploy, CreateContract, FromSrcTxContractData } from '../contract/deploy/CreateContract';
import { PstContract } from '../contract/PstContract';
import { Testing, Wallet } from '../contract/testing/Testing';
import { DefinitionLoader } from './modules/DefinitionLoader';
import { ExecutorFactory } from './modules/ExecutorFactory';
import { HandlerApi } from './modules/impl/HandlerExecutorFactory';
import { InteractionsLoader } from './modules/InteractionsLoader';
import { EvalStateResult, StateEvaluator } from './modules/StateEvaluator';
import { WarpBuilder } from './WarpBuilder';
import { WarpPluginType, WarpPlugin } from './WarpPlugin';
import { SortKeyCache } from '../cache/SortKeyCache';
import { ContractDefinition } from './ContractDefinition';
import { SignatureType } from '../contract/Signature';
import { SourceData } from '../contract/deploy/impl/SourceImpl';
import Transaction from 'arweave/node/lib/transaction';
export type WarpEnvironment = 'local' | 'testnet' | 'mainnet' | 'custom';
/**
 * The Warp "motherboard" ;-).
 * This is the base class that supplies the implementation of the SmartWeave protocol
 * Allows to plug-in different implementation of all the modules defined in the constructor.
 *
 * After being fully configured, it allows to "connect" to
 * contract and perform operations on them (see {@link Contract})
 */
export declare class Warp {
    readonly arweave: Arweave;
    readonly definitionLoader: DefinitionLoader;
    readonly interactionsLoader: InteractionsLoader;
    readonly executorFactory: ExecutorFactory<HandlerApi<unknown>>;
    readonly stateEvaluator: StateEvaluator;
    readonly environment: WarpEnvironment;
    /**
     * @deprecated createContract will be a private field, please use its methods directly e.g. await warp.deploy(...)
     */
    readonly createContract: CreateContract;
    readonly testing: Testing;
    private readonly plugins;
    constructor(arweave: Arweave, definitionLoader: DefinitionLoader, interactionsLoader: InteractionsLoader, executorFactory: ExecutorFactory<HandlerApi<unknown>>, stateEvaluator: StateEvaluator, environment?: WarpEnvironment);
    static builder(arweave: Arweave, stateCache: SortKeyCache<EvalStateResult<unknown>>, environment: WarpEnvironment): WarpBuilder;
    /**
     * Allows to connect to any contract using its transaction id.
     * @param contractTxId
     * @param callingContract
     */
    contract<State>(contractTxId: string, callingContract?: Contract, innerCallData?: InnerCallData): Contract<State>;
    deploy(contractData: ContractData, disableBundling?: boolean): Promise<ContractDeploy>;
    deployFromSourceTx(contractData: FromSrcTxContractData, disableBundling?: boolean): Promise<ContractDeploy>;
    deployBundled(rawDataItem: Buffer): Promise<ContractDeploy>;
    createSourceTx(sourceData: SourceData, wallet: ArWallet | SignatureType): Promise<Transaction>;
    saveSourceTx(srcTx: Transaction, disableBundling?: boolean): Promise<string>;
    /**
     * Allows to connect to a contract that conforms to the Profit Sharing Token standard
     * @param contractTxId
     */
    pst(contractTxId: string): PstContract;
    useStateCache(stateCache: SortKeyCache<EvalStateResult<unknown>>): Warp;
    useContractCache(contractsCache: SortKeyCache<ContractDefinition<any>>): Warp;
    use(plugin: WarpPlugin<unknown, unknown>): Warp;
    hasPlugin(type: WarpPluginType): boolean;
    loadPlugin<P, Q>(type: WarpPluginType): WarpPlugin<P, Q>;
    generateWallet(): Promise<Wallet>;
}
//# sourceMappingURL=Warp.d.ts.map