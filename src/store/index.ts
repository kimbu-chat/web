import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { Reducer, RootAction, RootState } from 'typesafe-actions';
import { all } from 'redux-saga/effects';

import { signalRInvokeMiddleware } from './middlewares/websockets/signalR';

import type { Store, Dispatch } from 'redux';
import type { Saga, Task } from 'redux-saga';

export enum StoreKeys {
  AUTH = 'auth',
  INITIATION = 'initiation',
  USERS = 'users',
  MY_PROFILE = 'myProfile',
  SETTINGS = 'settings',
  CHATS = 'chats',
  LOGIN = 'login',
  CALLS = 'calls',
  FRIENDS = 'friends',
  INTERNET = 'internet',
  LOCATION = 'location',
}

type CustomReducer = Reducer<RootState, RootAction>;

type ReducersStore = {
  [key in StoreKeys]?: CustomReducer;
};

type InjectorReduxStore = Store<ReducersStore, RootAction> & {
  dispatch: Dispatch;
  injectReducer: (key: StoreKeys, asyncReducer: CustomReducer) => void;
  injectSaga: <S extends Saga>(key: StoreKeys, saga: S) => void;
  asyncReducers: ReducersStore;
  inject: <S extends Saga>(
    injector: [StoreKeys, Reducer<RootState, RootAction> | undefined, S | undefined][],
  ) => void;
};

const staticReducers = {};

function* staticRootSaga() {
  yield all([]);
}

function createReducer(asyncReducers?: ReducersStore) {
  return combineReducers({
    ...staticReducers,
    ...asyncReducers,
  });
}

function createSagaInjector(
  runSaga: <S extends Saga>(saga: S, ...args: Parameters<S>) => Task,
  rootSaga: Saga,
) {
  const injectedSagas = new Map();

  const isInjected = (key: string) => injectedSagas.has(key);

  const injectSaga = (key: string, saga: Parameters<typeof runSaga>[0]) => {
    // We won't run saga if it is already injected
    if (isInjected(key)) return;
    // Sagas return task when they executed, which can be used
    // to cancel them
    const task = runSaga(saga);

    // Save the task if we want to cancel it in the future
    injectedSagas.set(key, task);
  };

  // Inject the root saga as it a staticlly loaded file,
  injectSaga('location', rootSaga);

  return injectSaga;
}

function configureStore(): InjectorReduxStore {
  const composeEnchancers =
    process.env.NODE_ENV === 'development'
      ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
      : compose;
  const sagaMiddleware = createSagaMiddleware();
  const enchancers = composeEnchancers(applyMiddleware(sagaMiddleware, signalRInvokeMiddleware));
  const store: any = createStore(createReducer(), enchancers);
  store.asyncReducers = {};

  store.injectReducer = (key: StoreKeys, asyncReducer: Reducer<RootState, RootAction>) => {
    store.asyncReducers[key] = asyncReducer;
    store.replaceReducer(createReducer(store.asyncReducers));
  };

  store.injectSaga = createSagaInjector(sagaMiddleware.run, staticRootSaga);

  store.inject = <S extends Saga>(
    injector: [StoreKeys, Reducer<RootState, RootAction> | undefined, S | undefined][],
  ) => {
    injector.forEach((inj) => {
      if (inj[1]) {
        store.injectReducer(inj[0], inj[1]);
      }

      if (inj[2]) {
        store.injectSaga(inj[0], inj[2]);
      }
    });
  };

  return store;
}

export default configureStore;
