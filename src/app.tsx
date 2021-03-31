import React, { Suspense, lazy } from 'react';
import { Redirect, Route, Switch } from 'react-router';

import './base.scss';

import { useSelector } from 'react-redux';

import { useTranslation } from 'react-i18next';

import { PublicRoute } from '@routing/public-route';
import { PrivateRoute } from '@routing/private-route';

import { authenticatedSelector, authPhoneNumberSelector } from '@store/auth/selectors';
import { LocalizationContext } from '@contexts';
import { CubeLoader } from '@containers/cube-loader/cube-loader';
import {
  loadPhoneConfirmation,
  loadCodeConfirmation,
  loadMessenger,
  loadNotFound,
  loadRegistration,
  loadLogout,
  loadMessageSmiles,
} from './routing/module-loader';
import i18nConfiguration from './localization/i18n';
import audioFile from './assets/sounds/calls/imcoming-call.ogg';

const ConfirmPhone = lazy(loadPhoneConfirmation);
const ConfirmCode = lazy(loadCodeConfirmation);
const Messenger = lazy(loadMessenger);
const NotFound = lazy(loadNotFound);
const Registration = lazy(loadRegistration);
const Logout = lazy(loadLogout);

export const App = () => {
  const audio = new Audio(audioFile);
  const { t, i18n } = useTranslation(undefined, { i18n: i18nConfiguration });
  const isAuthenticated = useSelector(authenticatedSelector);
  const phoneNumber = useSelector(authPhoneNumberSelector);

  return (
    <>
      <button
        type="button"
        onClick={() => {
          audio.play();
        }}>
        CLICK HERE
      </button>
      <LocalizationContext.Provider value={{ t, i18n }}>
        <Switch>
          <PublicRoute
            exact
            path="/signup"
            isAllowed={phoneNumber.length > 0}
            componentToRender={
              <Suspense fallback={<CubeLoader />}>
                <Registration preloadNext={loadMessenger} />
              </Suspense>
            }
          />
          <PublicRoute
            exact
            path="/confirm-code"
            isAllowed={phoneNumber.length > 0}
            componentToRender={
              <Suspense fallback={<CubeLoader />}>
                <ConfirmCode preloadNext={loadMessenger} />
              </Suspense>
            }
          />
          <PublicRoute
            exact
            path="/login/"
            componentToRender={
              <Suspense fallback={<CubeLoader />}>
                <ConfirmPhone preloadNext={loadCodeConfirmation} />
              </Suspense>
            }
          />
          <PrivateRoute
            path="/(contacts|calls|chats|settings)/:id(\d+)?/(profile|notifications|typing|language|appearance|audio-video|privacy-security)?"
            exact
            isAllowed={isAuthenticated}
            fallback="/login"
            componentToRender={
              <Suspense fallback={<CubeLoader />}>
                <Messenger preloadNext={loadMessageSmiles} />
              </Suspense>
            }
          />
          <PrivateRoute
            path="/logout"
            exact
            isAllowed={isAuthenticated}
            fallback="/login"
            componentToRender={
              <Suspense fallback={<CubeLoader />}>
                <Logout />
              </Suspense>
            }
          />
          <Route path="/" exact render={() => <Redirect to="/chats" />} />
          <Route
            path="/"
            render={() => (
              <Suspense fallback={<CubeLoader />}>
                <NotFound />
              </Suspense>
            )}
          />
        </Switch>
      </LocalizationContext.Provider>
    </>
  );
};
