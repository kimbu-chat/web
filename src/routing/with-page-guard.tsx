import React, { ReactElement } from 'react';

import isEmpty from 'lodash/isEmpty';
import { useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';

import { AuthService } from '@services/auth-service';

import {
  ANONYMOUS_USER,
  HOME_PAGE_PATH,
  PROSPECT_USER,
  REGISTERED_USER,
} from './routing.constants';

import type { Preload, UserStatus } from './routing.types';
import type { RouteComponentProps } from 'react-router-dom';

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
  (Component: React.FC<RouteComponentProps> & Preload): React.FC<RouteComponentProps> => {
    const RouteComponent = (props: any): ReactElement => {
      const userStatus = useSelector(userStatusSelector);
      if (allowedUsers.indexOf(userStatus) !== -1) {
        return <Component {...props} />;
      }
      return <Redirect to={fallbackUrl || HOME_PAGE_PATH} />;
    };

    RouteComponent.preload = Component.preload;

    return RouteComponent;
  };

export default withPageGuard;
