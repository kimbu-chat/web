import React from 'react';
import { Route, Redirect } from 'react-router';
import { useSelector } from 'react-redux';
import { RootState } from 'app/store/root-reducer';

namespace PublicRoute {
  export interface Props {
    Component: any;
    path: string;
  }
}

function PublicRoute({ Component, path, ...rest }: PublicRoute.Props) {
  const isAuthenticated = useSelector<RootState, boolean>((rootState) => rootState.auth.isAuthenticated) || false;
  return (
    <Route
      path={path}
      {...rest}
      render={({ location }) =>
        !isAuthenticated ? (
          <Component />
        ) : (
          <Redirect
            to={{
              pathname: '/chats',
              state: { from: location }
            }}
          />
        )
      }
    />
  );
}

export default PublicRoute;
