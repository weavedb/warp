import { ArWallet } from '../CreateContract';
import { Source } from '../Source';
import { Buffer } from 'redstone-isomorphic';
import { Warp } from '../../../core/Warp';
import { SignatureType } from '../../../contract/Signature';
import Transaction from 'arweave/node/lib/transaction';
export interface SourceData {
    src: string | Buffer;
    wasmSrcCodeDir?: string;
    wasmGlueCode?: string;
}
export declare class SourceImpl implements Source {
    private readonly warp;
    private readonly logger;
    private signature;
    constructor(warp: Warp);
    createSourceTx(sourceData: SourceData, wallet: ArWallet | SignatureType): Promise<Transaction>;
    saveSourceTx(srcTx: Transaction, disableBundling?: boolean): Promise<string>;
    private isGoModule;
    private joinBuffers;
    private zipContents;
    private postSource;
}
//# sourceMappingURL=SourceImpl.d.ts.map