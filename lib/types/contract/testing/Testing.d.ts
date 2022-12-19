import Arweave from 'arweave';
import { JWKInterface } from 'arweave/node/lib/wallet';
export type Wallet = {
    jwk: JWKInterface;
    address: string;
};
export declare class Testing {
    private readonly arweave;
    constructor(arweave: Arweave);
    mineBlock(): Promise<void>;
    addFunds(wallet: JWKInterface): Promise<void>;
    isArlocal(): Promise<boolean>;
    private validateEnv;
}
//# sourceMappingURL=Testing.d.ts.map