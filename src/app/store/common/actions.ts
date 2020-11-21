import { ActionCreatorBuilder, createAction, TypeConstant } from 'typesafe-actions';

type Deferred<TData = object, TException = undefined> = {
	resolve: (data?: TData) => void;
	reject: (e?: TException) => void;
};

export type Meta = {
	deferred: Deferred;
};

export function createEmptyAction<TType extends TypeConstant>(type: TType): ActionCreatorBuilder<TType> {
	return createAction(type)<undefined>();
}

export type Fn = (...args: any[]) => any;
export type FnMap = { [key: string]: Fn };
export type ActionUnionType<T extends FnMap> = ReturnType<T[keyof T]>; // union of return types
