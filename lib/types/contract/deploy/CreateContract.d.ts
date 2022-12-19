/// <reference types="node" />
import { JWKInterface } from 'arweave/node/lib/wallet';
import { SignatureType } from '../../contract/Signature';
import { Source } from './Source';
import { EvaluationOptions } from '../../core/modules/StateEvaluator';
import { WarpPluginType } from '../../core/WarpPlugin';
export type Tags = {
    name: string;
    value: string;
}[];
export type ArWallet = JWKInterface | 'use_wallet';
export type ContractType = 'js' | 'wasm';
export type ArTransfer = {
    target: string;
    winstonQty: string;
};
export declare const emptyTransfer: ArTransfer;
export type EvaluationManifest = {
    evaluationOptions: Partial<EvaluationOptions>;
    plugins?: WarpPluginType[];
};
export interface CommonContractData {
    wallet: ArWallet | SignatureType;
    initState: string;
    tags?: Tags;
    transfer?: ArTransfer;
    data?: {
        'Content-Type': string;
        body: string | Uint8Array | ArrayBuffer;
    };
    evaluationManifest?: EvaluationManifest;
}
export interface ContractData extends CommonContractData {
    src: string | Buffer;
    wasmSrcCodeDir?: string;
    wasmGlueCode?: string;
}
export interface FromSrcTxContractData extends CommonContractData {
    srcTxId: string;
}
export interface ContractDeploy {
    contractTxId: string;
    srcTxId?: string;
}
export interface CreateContract extends Source {
    deploy(contractData: ContractData, disableBundling?: boolean): Promise<ContractDeploy>;
    deployFromSourceTx(contractData: FromSrcTxContractData, disableBundling?: boolean): Promise<ContractDeploy>;
    deployBundled(rawDataItem: Buffer): Promise<ContractDeploy>;
}
//# sourceMappingURL=CreateContract.d.ts.map