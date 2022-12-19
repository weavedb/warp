export declare const knownWarpPlugins: readonly ["evm-signature-verification", "smartweave-extension-nlp", "smartweave-extension-ethers", "subscription", "ivm-handler-api", "evaluation-progress"];
export type WarpPluginType = typeof knownWarpPlugins[number];
export interface WarpPlugin<T, R> {
    type(): WarpPluginType;
    process(input: T): R;
}
//# sourceMappingURL=WarpPlugin.d.ts.map