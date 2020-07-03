import React from 'react';
import { Route, Redirect, useParams } from 'react-router';
import { useSelector } from 'react-redux';
import { AppState } from 'app/store';

namespace PrivateRoute {
  export interface Props {
    Component: any;
    path: string;
  }
}

function PrivateRoute({ Component, path, ...rest }: PrivateRoute.Props) {
  const isAuthenticated = useSelector<AppState, boolean>((rootState) => rootState.auth.isAuthenticated) || false;
  const params = useParams;
  return (
    <Route
      path={path}
      {...rest}
      render={({ location }) =>
        isAuthenticated ? (
          <Component {...params} />
        ) : (
          <Redirect
            to={{
              pathname: '/login',
              state: { from: location }
            }}
          />
        )
      }
    />
  );
}

export default PrivateRoute;
