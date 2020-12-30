import React from 'react';
import { Route, Redirect, RouteProps } from 'react-router';
import { useSelector } from 'react-redux';
import { amIlogged } from 'app/store/auth/selectors';

namespace PublicRouteNS {
  export interface IProps extends RouteProps {
    Component: JSX.Element;
    path: string;
    isAllowed?: boolean;
  }
}

export const PublicRoute = React.memo(({ Component, path, isAllowed = true, ...rest }: PublicRouteNS.IProps) => {
  const isAuthenticated = useSelector(amIlogged);
  return (
    <Route
      path={path}
      {...rest}
      render={({ location }) =>
        !isAuthenticated && isAllowed ? (
          Component
        ) : (
          <Redirect
            to={{
              pathname: '/chats',
              state: { from: location },
            }}
          />
        )
      }
    />
  );
});
