import Arweave from 'arweave';
import { ContractDefinition } from '../../../core/ContractDefinition';
import { ExecutionContext } from '../../../core/ExecutionContext';
import { GQLNodeInterface } from '../../../legacy/gqlResult';
import { SmartWeaveGlobal } from '../../../legacy/smartweave-global';
import { ExecutorFactory } from '../ExecutorFactory';
import { EvalStateResult, EvaluationOptions } from '../StateEvaluator';
import { Warp } from '../../Warp';
export declare class ContractError extends Error {
    readonly subtype?: string;
    constructor(message: any, subtype?: string);
}
/**
 * A factory that produces handlers that are compatible with the "current" style of
 * writing SW contracts (i.e. using "handle" function).
 */
export declare class HandlerExecutorFactory implements ExecutorFactory<HandlerApi<unknown>> {
    private readonly arweave;
    private readonly logger;
    private readonly cache;
    constructor(arweave: Arweave);
    create<State>(contractDefinition: ContractDefinition<State>, evaluationOptions: EvaluationOptions, warp: Warp): Promise<HandlerApi<State>>;
}
export interface InteractionData<Input> {
    interaction?: ContractInteraction<Input>;
    interactionTx: GQLNodeInterface;
    currentTx: {
        interactionTxId: string;
        contractTxId: string;
    }[];
}
/**
 * A handle that effectively runs contract's code.
 */
export interface HandlerApi<State> {
    handle<Input, Result>(executionContext: ExecutionContext<State>, currentResult: EvalStateResult<State>, interactionData: InteractionData<Input>): Promise<InteractionResult<State, Result>>;
    initState(state: State): void;
}
export type HandlerFunction<State, Input, Result> = (state: State, interaction: ContractInteraction<Input>) => Promise<HandlerResult<State, Result>>;
export type HandlerResult<State, Result> = {
    result: Result;
    state: State;
    gasUsed?: number;
};
export type InteractionResult<State, Result> = HandlerResult<State, Result> & {
    type: InteractionResultType;
    errorMessage?: string;
    originalValidity?: Record<string, boolean>;
    originalErrorMessages?: Record<string, string>;
};
export type ContractInteraction<Input> = {
    input: Input;
    caller: string;
};
export type InteractionResultType = 'ok' | 'error' | 'exception';
export interface IvmOptions {
    memoryLimit?: number;
    timeout?: number;
}
export interface IvmPluginInput {
    contractSource: string;
    evaluationOptions: EvaluationOptions;
    arweave: Arweave;
    swGlobal: SmartWeaveGlobal;
    contractDefinition: ContractDefinition<any>;
}
//# sourceMappingURL=HandlerExecutorFactory.d.ts.map