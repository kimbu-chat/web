type Deferred = {
  resolve: (data?: any) => void;
  reject: (e?: never) => void;
};

export interface Action<T extends string> {
  type: T;
  deferred?: Deferred;
}

export interface ActionWithPayload<T extends string, P> extends Action<T> {
  payload: P;
}

export function createAction<T extends string>(type: T, deferred?: Deferred): Action<T>;
export function createAction<T extends string, P>(type: T, payload: P, deferred?: Deferred): ActionWithPayload<T, P>;
export function createAction<T extends string, P>(
  type: T,
  payload?: P,
  deferred?: Deferred
): Action<T> | ActionWithPayload<T, P> {
  return payload === undefined ? { type } : { type, payload, deferred };
}

