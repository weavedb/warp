import Arweave from 'arweave';
import Transaction from 'arweave/node/lib/transaction';
import { SignatureType } from '../../../contract/Signature';
import { Warp } from '../../../core/Warp';
import { CreateContract, ContractData, ContractDeploy, FromSrcTxContractData, ArWallet } from '../CreateContract';
import { SourceData } from './SourceImpl';
import { Buffer } from 'redstone-isomorphic';
export declare class DefaultCreateContract implements CreateContract {
    private readonly arweave;
    private warp;
    private readonly logger;
    private readonly source;
    private signature;
    constructor(arweave: Arweave, warp: Warp);
    deploy(contractData: ContractData, disableBundling?: boolean): Promise<ContractDeploy>;
    deployFromSourceTx(contractData: FromSrcTxContractData, disableBundling?: boolean, srcTx?: Transaction): Promise<ContractDeploy>;
    deployBundled(rawDataItem: Buffer): Promise<ContractDeploy>;
    createSourceTx(sourceData: SourceData, wallet: ArWallet | SignatureType): Promise<Transaction>;
    saveSourceTx(srcTx: Transaction, disableBundling?: boolean): Promise<string>;
    private postContract;
}
//# sourceMappingURL=DefaultCreateContract.d.ts.map