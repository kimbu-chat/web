import React, { Suspense, lazy } from 'react';
import { Redirect, Route, Switch } from 'react-router';

import 'react-toastify/dist/ReactToastify.css';
import './base.scss';
import './toastify.scss';

import { useSelector } from 'react-redux';
import { ReactComponent as CloseSvg } from '@icons/close.svg';
import { PublicRoute } from '@routing/public-route';
import { PrivateRoute } from '@routing/private-route';

import { authenticatedSelector, authPhoneNumberExistsSelector } from '@store/auth/selectors';
import { CubeLoader } from '@containers/cube-loader/cube-loader';
import { ToastContainer } from 'react-toastify';
import {
  loadPhoneConfirmation,
  loadCodeConfirmation,
  loadMessenger,
  loadNotFound,
  loadRegistration,
  loadLogout,
  loadEmoji,
} from './routing/module-loader';
import '@localization/i18n';
import './dayjs/day';

const ConfirmPhone = lazy(loadPhoneConfirmation);
const ConfirmCode = lazy(loadCodeConfirmation);
const Messenger = lazy(loadMessenger);
const NotFound = lazy(loadNotFound);
const Registration = lazy(loadRegistration);
const Logout = lazy(loadLogout);

const App = () => {
  const isAuthenticated = useSelector(authenticatedSelector);
  const phoneNumberExists = useSelector(authPhoneNumberExistsSelector);

  return (
    <>
      <Suspense fallback={<CubeLoader />}>
        <Switch>
          <PublicRoute
            exact
            path="/signup"
            isAllowed={!isAuthenticated && phoneNumberExists}
            componentToRender={<Registration preloadNext={loadMessenger} />}
          />
          <PublicRoute
            exact
            path="/confirm-code"
            isAllowed={!isAuthenticated && phoneNumberExists}
            componentToRender={<ConfirmCode preloadNext={loadMessenger} />}
          />
          <PublicRoute
            exact
            path="/login/"
            isAllowed={!isAuthenticated}
            componentToRender={<ConfirmPhone preloadNext={loadCodeConfirmation} />}
          />
          <PrivateRoute
            path="/(contacts|calls|chats|settings)/:id(\d+)?/(profile|notifications|typing|language|appearance|audio-video|privacy-security)?"
            exact
            isAllowed={isAuthenticated}
            fallback="/login"
            componentToRender={<Messenger preloadNext={loadEmoji} />}
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
