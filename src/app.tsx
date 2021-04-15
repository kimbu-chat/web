import React, { Suspense, lazy } from 'react';
import { Redirect, Route, Switch } from 'react-router';

import 'react-toastify/dist/ReactToastify.css';
import './base.scss';
import './toastify.scss';

import { useSelector } from 'react-redux';
import { ReactComponent as CloseSvg } from '@icons/close.svg';
import { PublicRoute } from '@routing/public-route';
import { PrivateRoute } from '@routing/private-route';

import { authenticatedSelector, authPhoneNumberSelector } from '@store/auth/selectors';
import { CubeLoader } from '@containers/cube-loader/cube-loader';
import { ToastContainer } from 'react-toastify';
import {
  loadPhoneConfirmation,
  loadCodeConfirmation,
  loadMessenger,
  loadNotFound,
  loadRegistration,
  loadLogout,
  loadDeferredSmiles,
} from './routing/module-loader';
import '@localization/i18n';

const ConfirmPhone = lazy(loadPhoneConfirmation);
const ConfirmCode = lazy(loadCodeConfirmation);
const Messenger = lazy(loadMessenger);
const NotFound = lazy(loadNotFound);
const Registration = lazy(loadRegistration);
const Logout = lazy(loadLogout);

export const App = () => {
  const isAuthenticated = useSelector(authenticatedSelector);
  const phoneNumber = useSelector(authPhoneNumberSelector);

  return (
    <>
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
              <Messenger preloadNext={loadDeferredSmiles} />
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
      <ToastContainer
        autoClose={5000000}
        position="top-center"
        hideProgressBar
        closeButton={
          <button type="button">
            <CloseSvg />
          </button>
        }
      />
    </>
  );
};
