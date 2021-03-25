import { ActionCreatorBuilder, createAction, PayloadMetaActionCreator, RootState, TypeConstant } from 'typesafe-actions';

type Deferred<TData, TException> = {
  resolve: (data?: TData) => void;
  reject: (e?: TException) => void;
};

export type Meta<TData = Record<string, unknown>, TException = undefined> = {
  deferred: Deferred<TData, TException>;
};

export function createEmptyAction<TType extends TypeConstant>(type: TType): ActionCreatorBuilder<TType> {
  return createAction(type)<undefined>();
}

export function createEmptyDefferedAction<TType extends TypeConstant>(type: TType): PayloadMetaActionCreator<TType, undefined, Meta> {
  return createAction(type)<undefined, Meta>();
}

export function NoopAction(state: RootState): RootState {
  return state;
}
