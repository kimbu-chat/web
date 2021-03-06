import React, { useMemo, lazy } from 'react';

import isEmpty from 'lodash/isEmpty';
import { useSelector } from 'react-redux';

import { AuthService } from '@services/auth-service';
import { store, StoreKeys } from '@store';

const authService = new AuthService();
const isTokenExistInStorage = !isEmpty(authService.securityTokens);

const userAuthorizedSelector = (state: RootState) =>
  state.login?.isAuthenticated || isTokenExistInStorage;

const AuthRouter = lazy(() => import('@routing/auth-router'));

const MainRouter = lazy(async () => {
  const [
    initModule,
    authModule,
    usersModule,
    myProfileModule,
    settingsModule,
    chatsModule,
    friendsModule,
    internet,
  ] = await Promise.all([
    import('@store/initiation/sagas'),
    import('@store/auth/module'),
    import('@store/users/module'),
    import('@store/my-profile/module'),
    import('@store/settings/module'),
    import('@store/chats/module'),
    import('@store/friends/module'),
    import('@store/internet/module'),
  ]);

  store.inject([
    [StoreKeys.AUTH, authModule.reducer, authModule.authSagas],
    [StoreKeys.INITIATION, undefined, initModule.initiationSaga],
    [StoreKeys.USERS, usersModule.reducer, usersModule.usersSaga],
    [StoreKeys.MY_PROFILE, myProfileModule.reducer, myProfileModule.myProfileSagas],
    [StoreKeys.SETTINGS, settingsModule.reducer, settingsModule.settingsSaga],
    [StoreKeys.CHATS, chatsModule.reducer, chatsModule.chatSaga],
    [StoreKeys.FRIENDS, friendsModule.reducer, friendsModule.friendsSaga],
    [StoreKeys.INTERNET, internet.reducer, internet.internetSagas],
  ]);

  return import('@routing/main-router');
});

export const Layout: React.FC = () => {
  const isUserAuthorized = useSelector(userAuthorizedSelector);

  const routing = useMemo(() => {
    if (isUserAuthorized) {
      return <MainRouter />;
    }

    return <AuthRouter />;
  }, [isUserAuthorized]);

  return routing;
};
