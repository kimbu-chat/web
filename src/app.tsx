import React, { Suspense, lazy } from 'react';
import { Redirect, Route, Switch } from 'react-router';
import { ToastContainer } from 'react-toastify';
import isEmpty from 'lodash/isEmpty';
import 'react-toastify/dist/ReactToastify.css';

import { ReactComponent as CloseSvg } from '@icons/close.svg';
import { PrivateRoute } from '@components/private-route';
import { CubeLoader } from '@components/cube-loader';
import { AuthService } from '@services/auth-service';
import '@localization/i18n';

import './dayjs/day';
import { loadMessenger, loadNotFound, loadLogout, loadEmoji } from './routing/module-loader';

import './base.scss';
import './toastify.scss';
import { StoreKeys } from './store';

const NotFound = lazy(loadNotFound);
const Logout = lazy(loadLogout);

const App = ({ store }: { store: any }) => {
  const authService = new AuthService();
  const isAuthenticated = !isEmpty(authService.securityTokens);

  const Messenger = lazy(async () => {
    const initModule = await import('@store/initiation/sagas');
    const authModule = await import('@store/auth/module');
    const usersModule = await import('@store/users/module');
    const myProfileModule = await import('@store/my-profile/module');
    const settingsModule = await import('@store/settings/module');
    const chatsModule = await import('@store/chats/module');

    store.inject([[StoreKeys.AUTH, authModule.reducer, authModule.authSagas]]);

    store.injectReducer('auth', authModule.reducer);
    store.injectSaga('auth', authModule.authSagas);
    store.injectSaga('initiation', initModule.initiationSaga);
    store.injectReducer('users', usersModule.reducer);
    store.injectSaga('users', usersModule.usersSaga);
    store.injectReducer('myProfile', myProfileModule.reducer);
    store.injectSaga('myProfile', myProfileModule.myProfileSagas);
    store.injectReducer('settings', settingsModule.reducer);
    store.injectSaga('settings', settingsModule.settingsSaga);
    store.injectReducer('chats', chatsModule.reducer);
    store.injectSaga('chats', chatsModule.chatSaga);

    return loadMessenger();
  });

  const LazyLoginRouter = lazy(async () => {
    console.log('LOGOGOGOGOGOG');
    const loginModule = await import('@store/login/module');
    store.injectReducer('login', loginModule.reducer);
    store.injectSaga('login', loginModule.loginSaga);

    return import('@routing/login/login');
  });

  return (
    <>
      <Suspense fallback={<CubeLoader />}>
        <Switch>
          {/* <LazyLoginRouter /> */}
          <PrivateRoute
            path="/(contacts|calls|chats|settings)/:id(\d+)?/(profile|notifications|typing|language|appearance|audio-video|privacy-security)?"
            exact
            isAllowed={isAuthenticated}
            fallback="/login"
            componentToRender={
              <Suspense fallback={<CubeLoader />}>
                <Messenger store={store} preloadNext={loadEmoji} />
              </Suspense>
            }
          />
          <PrivateRoute
            path="/logout"
            exact
            isAllowed={isAuthenticated}
            fallback="/login"
            componentToRender={<Logout />}
          />
          <Route path="/" exact render={() => <Redirect to="/chats" />} />
          <Route path="/" render={() => <NotFound />} />
        </Switch>
        <ToastContainer
          autoClose={5000000}
          position="top-center"
          hideProgressBar
          closeButton={() => (
            <button type="button">
              <CloseSvg />
            </button>
          )}
        />
      </Suspense>
    </>
  );
};

App.displayName = 'App';

export { App };
