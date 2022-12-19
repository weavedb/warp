import { ArWallet } from './CreateContract';
import { SourceData } from './impl/SourceImpl';
import { SignatureType } from '../../contract/Signature';
import Transaction from 'arweave/node/lib/transaction';
export interface Source {
    /**
     * allows to create contract source
     * @param sourceData - contract source data
     * @param wallet - either Arweave wallet or custom signature type
     */
    createSourceTx(sourceData: SourceData, wallet: ArWallet | SignatureType): Promise<Transaction>;
    /**
     * allows to save contract source
     * @param sourceTx - contract source transaction
     * @param disableBundling = whether source should be deployed through bundlr using Warp Gateway
     */
    saveSourceTx(sourceTx: Transaction, disableBundling?: boolean): Promise<string>;
}
//# sourceMappingURL=Source.d.ts.map