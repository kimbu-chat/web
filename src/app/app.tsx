import React, { Suspense, lazy, useEffect } from 'react';
import { Redirect, Route, Switch } from 'react-router';

import './base.scss';

import { useSelector } from 'react-redux';

import i18nConfiguration from 'app/localization/i18n';
import { useTranslation } from 'react-i18next';

import { PublicRoute } from 'app/routing/private-route';
import { PrivateRoute } from 'app/routing/public-route';

import { i18n, TFunction } from 'i18next';
import { CubeLoader } from './containers/cube-loader/cube-loader';
import { loadPhoneConfirmation, loadCodeConfirmation, loadMessenger, loadNotFound, loadRegistration } from './routing/module-loader';
import { amIlogged, getAuthPhoneNumber, getRegistrationNeeded } from './store/auth/selectors';

const ConfirmPhone = lazy(loadPhoneConfirmation);
const ConfirmCode = lazy(loadCodeConfirmation);
const Messenger = lazy(loadMessenger);
const NotFound = lazy(loadNotFound);
const Registration = lazy(loadRegistration);

namespace AppNS {
  export interface Localization {
    t: TFunction;
    i18n?: i18n;
  }
}

export const LocalizationContext = React.createContext<AppNS.Localization>({ t: (str: string) => str });

export const App = () => {
  const { t, i18n } = useTranslation(undefined, { i18n: i18nConfiguration });
  const isAuthenticated = useSelector(amIlogged);
  const phoneNumber = useSelector(getAuthPhoneNumber);
  const registrationNeeded = useSelector(getRegistrationNeeded);

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('./firebase-messaging-sw.js')
        .then((registration) => {
          console.log('Registration successful, scope is:', registration.scope);
        })
        .catch((err) => {
          console.log('Service worker registration failed, error:', err);
        });
    }
  }, []);

  return (
    <LocalizationContext.Provider value={{ t, i18n }}>
      <Switch>
        <PublicRoute
          exact
          path='/registration'
          isAllowed={phoneNumber.length > 0 && registrationNeeded}
          Component={
            <Suspense fallback={<CubeLoader />}>
              <Registration preloadNext={loadMessenger} />
            </Suspense>
          }
        />
        <PublicRoute
          exact
          path='/confirm-code'
          isAllowed={phoneNumber.length > 0}
          Component={
            <Suspense fallback={<CubeLoader />}>
              <ConfirmCode preloadNext={loadMessenger} />
            </Suspense>
          }
        />
        <PublicRoute
          exact
          path='/login/'
          Component={
            <Suspense fallback={<CubeLoader />}>
              <ConfirmPhone preloadNext={loadCodeConfirmation} />
            </Suspense>
          }
        />
        <PrivateRoute
          path='/(contacts|calls|settings|chats)/:chatId?/(edit-profile|notifications|language|typing)?/(info)?/(photo|audio-recordings|audios|video|files)?'
          exact
          isAllowed={isAuthenticated}
          fallback='/login'
          Component={
            <Suspense fallback={<CubeLoader />}>
              <Messenger />
            </Suspense>
          }
        />
        <Route path='/' exact render={() => <Redirect to='/chats' />} />
        <Route
          path='/'
          render={() => (
            <Suspense fallback={<CubeLoader />}>
              <NotFound />
            </Suspense>
          )}
        />
      </Switch>
    </LocalizationContext.Provider>
  );
};
