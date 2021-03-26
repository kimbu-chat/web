import { createStore, applyMiddleware, compose, Store, Action, Dispatch } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { RootState } from 'typesafe-actions';
import rootReducer from './root-reducer';
import { rootSaga } from './root-saga';
import { signalRInvokeMiddleware } from './middlewares/websockets/signalR';

type ReduxStore = Store<RootState, Action> & {
  dispatch: Dispatch;
};

function makeStore(): ReduxStore {
  const composeEnchancers =
    process.env.NODE_ENV === 'development'
      ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
      : compose;
  const sagaMiddleware = createSagaMiddleware();
  const enchancers = composeEnchancers(applyMiddleware(sagaMiddleware, signalRInvokeMiddleware));
  const store = createStore(rootReducer, enchancers);

  sagaMiddleware.run(rootSaga);

  return store;
}

export default makeStore;
