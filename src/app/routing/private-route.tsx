import React from 'react';
import { Route, Redirect, RouteProps } from 'react-router';
import { useSelector } from 'react-redux';
import { RootState } from 'store/root-reducer';

namespace PublicRouteNS {
  export interface Props extends RouteProps {
    Component: JSX.Element;
    path: string;
    isAllowed?: boolean;
  }
}

export const PublicRoute = React.memo(({ Component, path, isAllowed = true, ...rest }: PublicRouteNS.Props) => {
  const isAuthenticated = useSelector<RootState, boolean>((rootState) => rootState.auth.isAuthenticated);
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
