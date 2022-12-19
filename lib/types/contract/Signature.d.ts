import Transaction from 'arweave/node/lib/transaction';
import { Warp } from '../core/Warp';
import { ArWallet } from './deploy/CreateContract';
export type SigningFunction = (tx: Transaction) => Promise<void>;
export type SignatureType = {
    signer: SigningFunction;
    type: 'arweave' | 'ethereum';
};
export declare class Signature {
    readonly signer: SigningFunction;
    readonly type: 'arweave' | 'ethereum';
    readonly warp: Warp;
    constructor(warp: Warp, walletOrSignature: ArWallet | SignatureType);
    checkNonArweaveSigningAvailability(bundling: boolean): void;
    private isSignatureType;
}
//# sourceMappingURL=Signature.d.ts.map