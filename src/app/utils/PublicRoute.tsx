import React from 'react';
import { Route, Redirect } from 'react-router';
import { useSelector } from 'react-redux';
import { AppState } from 'app/store';

namespace PublicRoute {
  export interface Props {
    Component: any;
    path: string;
  }
}

function PublicRoute({ Component, path, ...rest }: PublicRoute.Props) {
  const isAuthenticated = useSelector<AppState, boolean>((rootState) => rootState.auth.isAuthenticated) || false;
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
