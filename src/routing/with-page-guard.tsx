import React, { ReactElement } from 'react';

import isEmpty from 'lodash/isEmpty';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

import { AuthService } from '@services/auth-service';

import { ANONYMOUS_USER, HOME_PAGE_PATH, PROSPECT_USER, REGISTERED_USER } from './routing.constants';

import type { Preload, UserStatus } from './routing.types';

const userStatusSelector = (state: RootState): UserStatus => {
  const authService = new AuthService();
  const isTokenExistInStorage = !isEmpty(authService.securityTokens);
  const isUserAuthorized = state.login?.isAuthenticated || isTokenExistInStorage;
  const isProspectUser = state.login?.phoneNumber || state.login?.googleAuthIdToken;

  if (isUserAuthorized) {
    return REGISTERED_USER;
  }

  return isProspectUser ? PROSPECT_USER : ANONYMOUS_USER;
};

const withPageGuard =
  (allowedUsers: UserStatus[], fallbackUrl?: string) =>
  (Component: React.FC & Preload): React.FC => {
    const RouteComponent = (props: any): ReactElement => {
      const userStatus = useSelector(userStatusSelector);
      if (allowedUsers.indexOf(userStatus) !== -1) {
        return <Component {...props} />;
      }
      return <Navigate to={fallbackUrl || HOME_PAGE_PATH} />;
    };

    RouteComponent.preload = Component.preload;

    return RouteComponent;
  };

export default withPageGuard;
