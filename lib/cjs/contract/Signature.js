"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Signature = void 0;
class Signature {
    constructor(warp, walletOrSignature) {
        this.warp = warp;
        if (this.isSignatureType(walletOrSignature)) {
            if (walletOrSignature.type !== 'arweave' &&
                (!(this.warp.environment == 'mainnet') || !(this.warp.interactionsLoader.type() == 'warp'))) {
                throw new Error(`Unable to use signing function of type: ${walletOrSignature.type} when not in mainnet environment or bundling is disabled.`);
            }
            else {
                this.signer = walletOrSignature.signer;
                this.type = walletOrSignature.type;
            }
        }
        else {
            this.signer = async (tx) => {
                await this.warp.arweave.transactions.sign(tx, walletOrSignature);
            };
            this.type = 'arweave';
        }
    }
    checkNonArweaveSigningAvailability(bundling) {
        if (this.type !== 'arweave' && !bundling) {
            throw new Error(`Unable to use signing function of type: ${this.type} when bundling is disabled.`);
        }
    }
    isSignatureType(signature) {
        return signature.signer !== undefined;
    }
}
exports.Signature = Signature;
//# sourceMappingURL=Signature.js.map