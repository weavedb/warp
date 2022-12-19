import Arweave from 'arweave';
import { ContractDefinition, ContractSource } from '../../../core/ContractDefinition';
import { ArweaveWrapper } from '../../../utils/ArweaveWrapper';
import { DefinitionLoader } from '../DefinitionLoader';
import { GW_TYPE } from '../InteractionsLoader';
import { WarpEnvironment } from '../../Warp';
import { SortKeyCache } from '../../../cache/SortKeyCache';
export declare class ContractDefinitionLoader implements DefinitionLoader {
    private readonly arweave;
    private readonly env;
    private readonly logger;
    protected arweaveWrapper: ArweaveWrapper;
    private readonly tagsParser;
    constructor(arweave: Arweave, env: WarpEnvironment);
    load<State>(contractTxId: string, evolvedSrcTxId?: string): Promise<ContractDefinition<State>>;
    doLoad<State>(contractTxId: string, forcedSrcTxId?: string): Promise<ContractDefinition<State>>;
    loadContractSource(contractSrcTxId: string): Promise<ContractSource>;
    private evalInitialState;
    type(): GW_TYPE;
    setCache(cache: SortKeyCache<ContractDefinition<any>>): void;
    getCache(): SortKeyCache<ContractDefinition<any>>;
}
//# sourceMappingURL=ContractDefinitionLoader.d.ts.map