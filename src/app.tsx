import React, { Suspense, lazy } from 'react';
import { Redirect, Route, Switch } from 'react-router';
import { ToastContainer } from 'react-toastify';
import isEmpty from 'lodash/isEmpty';
import 'react-toastify/dist/ReactToastify.css';
import { useSelector } from 'react-redux';

import { ReactComponent as CloseSvg } from '@icons/close.svg';
import { PrivateRoute } from '@components/private-route';
import { CubeLoader } from '@components/cube-loader';
import { AuthService } from '@services/auth-service';
import '@localization/i18n';

import './dayjs/day';
import {
  loadMessenger,
  loadNotFound,
  loadLogout,
  loadEmoji,
  loadLogin,
} from './routing/module-loader';
import { StoreKeys } from './store';

import './base.scss';
import './toastify.scss';
import type { RootState } from 'typesafe-actions';

const NotFound = lazy(loadNotFound);

const App = ({ store }: { store: any }) => {
  const authService = new AuthService();
  const isLoggined = useSelector((state: RootState) => state.login?.isAuthenticated);
  const isAuthenticated = isLoggined || !isEmpty(authService.securityTokens);

  const Login = lazy(async () => {
    const loginModule = await import('@store/login/module');

    store.inject([[StoreKeys.LOGIN, loginModule.reducer, loginModule.loginSaga]]);
    return loadLogin();
  });

  const Messenger = lazy(async () => {
    const [
      initModule,
      authModule,
      usersModule,
      myProfileModule,
      settingsModule,
      chatsModule,
      friendsModule,
    ] = await Promise.all([
      import('@store/initiation/sagas'),
      import('@store/auth/module'),
      import('@store/users/module'),
      import('@store/my-profile/module'),
      import('@store/settings/module'),
      import('@store/chats/module'),
      import('@store/friends/module'),
    ]);

    store.inject([
      [StoreKeys.AUTH, authModule.reducer, authModule.authSagas],
      [StoreKeys.INITIATION, undefined, initModule.initiationSaga],
      [StoreKeys.USERS, usersModule.reducer, usersModule.usersSaga],
      [StoreKeys.MY_PROFILE, myProfileModule.reducer, myProfileModule.myProfileSagas],
      [StoreKeys.SETTINGS, settingsModule.reducer, settingsModule.settingsSaga],
      [StoreKeys.CHATS, chatsModule.reducer, chatsModule.chatSaga],
      [StoreKeys.FRIENDS, friendsModule.reducer, friendsModule.friendsSaga],
    ]);

    return loadMessenger();
  });

  const Logout = lazy(async () => {
    const authModule = await import('@store/auth/module');
    store.inject([[StoreKeys.AUTH, authModule.reducer, authModule.authSagas]]);

    return loadLogout();
  });

  return (
    <>
      <Suspense fallback={<CubeLoader />}>
        {!isAuthenticated ? (
          <Login store={store} />
        ) : (
          <Switch>
            <PrivateRoute
              path="/(contacts|calls|chats|settings)/:id(\d+)?/(profile|notifications|typing|language|appearance|audio-video|privacy-security)?"
              exact
              isAllowed
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
        )}

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
