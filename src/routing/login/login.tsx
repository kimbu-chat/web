import React, { lazy } from 'react';
import isEmpty from 'lodash/isEmpty';

import { PublicRoute } from '@components/public-route';
import {
  loadCodeConfirmation,
  loadMessenger,
  loadPhoneConfirmation,
  loadRegistration,
} from '@routing/module-loader';
import { AuthService } from '@services/auth-service';

const ConfirmCode = lazy(loadCodeConfirmation);
const Registration = lazy(loadRegistration);
const ConfirmPhone = lazy(loadPhoneConfirmation);

const LoginRouter: React.FC = () => {
  const authService = new AuthService();
  const isAuthenticated = !isEmpty(authService.securityTokens);
  return (
    <>
      <PublicRoute
        exact
        path="/signup"
        isAllowed={!isAuthenticated}
        componentToRender={<Registration preloadNext={loadMessenger} />}
      />
      <PublicRoute
        exact
        path="/confirm-code"
        isAllowed={!isAuthenticated}
        componentToRender={<ConfirmCode preloadNext={loadMessenger} />}
      />
      <PublicRoute
        exact
        path="/login/"
        isAllowed={!isAuthenticated}
        componentToRender={<ConfirmPhone preloadNext={loadCodeConfirmation} />}
      />
    </>
  );
};

export default LoginRouter;
