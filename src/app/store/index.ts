import { createStore, applyMiddleware, compose, Store, Action, Dispatch } from 'redux';
import createSagaMiddleware from 'redux-saga';
import rootReducer, { RootState } from './root-reducer';
import { rootSaga } from './root-saga';
import { signalRInvokeMiddleware } from './middlewares/websockets/signalR';

export type ReduxStore = Store<RootState, Action> & {
  dispatch: Dispatch;
};

export default function (): ReduxStore {
  const composeEnchancers = process.env.NODE_ENV === 'development' ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose : compose;
  const sagaMiddleware = createSagaMiddleware();
  const enchancers = composeEnchancers(applyMiddleware(sagaMiddleware, signalRInvokeMiddleware));
  const store: ReduxStore = createStore(rootReducer, enchancers);

  sagaMiddleware.run(rootSaga);
  if (process.env.NODE_ENV !== 'production' && (module as any).hot) {
    (module as any).hot.accept('./root-reducer', () => store.replaceReducer(rootReducer));
  }

  return store;
}
