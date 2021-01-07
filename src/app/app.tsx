import React, { Suspense, lazy } from 'react';
import { Redirect, Route, Switch } from 'react-router';

import './base.scss';

import { useSelector } from 'react-redux';

import i18nConfiguration from 'app/localization/i18n';
import { useTranslation } from 'react-i18next';

import { PublicRoute } from 'app/routing/public-route';
import { PrivateRoute } from 'app/routing/private-route';

import { i18n, TFunction } from 'i18next';
import { amILoggedSelector, getAuthPhoneNumberSelector, getRegstrationAllowedSelector } from 'store/auth/selectors';
import { CubeLoader } from './containers/cube-loader/cube-loader';
import { loadPhoneConfirmation, loadCodeConfirmation, loadMessenger, loadNotFound, loadRegistration } from './routing/module-loader';

const ConfirmPhone = lazy(loadPhoneConfirmation);
const ConfirmCode = lazy(loadCodeConfirmation);
const Messenger = lazy(loadMessenger);
const NotFound = lazy(loadNotFound);
const Registration = lazy(loadRegistration);

export interface ILocalizationContextProps {
  t: TFunction;
  i18n?: i18n;
}

export const LocalizationContext = React.createContext<ILocalizationContextProps>({ t: (str: string) => str });

export const App = () => {
  const { t, i18n } = useTranslation(undefined, { i18n: i18nConfiguration });
  const isAuthenticated = useSelector(amILoggedSelector);
  const phoneNumber = useSelector(getAuthPhoneNumberSelector);
  const registrationAllowed = useSelector(getRegstrationAllowedSelector);

  return (
    <LocalizationContext.Provider value={{ t, i18n }}>
      <Switch>
        <PublicRoute
          exact
          path='/signup'
          isAllowed={phoneNumber.length > 0 && registrationAllowed}
          componentToRender={
            <Suspense fallback={<CubeLoader />}>
              <Registration preloadNext={loadMessenger} />
            </Suspense>
          }
        />
        <PublicRoute
          exact
          path='/confirm-code'
          isAllowed={phoneNumber.length > 0}
          componentToRender={
            <Suspense fallback={<CubeLoader />}>
              <ConfirmCode preloadNext={loadMessenger} />
            </Suspense>
          }
        />
        <PublicRoute
          exact
          path='/login/'
          componentToRender={
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
          componentToRender={
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
