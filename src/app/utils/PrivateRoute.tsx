import React from 'react';
import { Route, Redirect } from 'react-router';
import { useSelector } from 'react-redux';
import { AppState } from 'app/store';

namespace PrivateRoute {
  export interface Props {
    component: JSX.Element;
    path: string;
  }
}

function PrivateRoute({ component, path, ...rest }: PrivateRoute.Props) {
  const isAuthenticated = useSelector<AppState, boolean>((rootState) => rootState.auth.isAuthenticated) || false;

  return (
    <Route
      path={path}
      {...rest}
      render={({ location }) =>
        isAuthenticated ? (
          component
        ) : (
          <Redirect
            to={{
              pathname: '/',
              state: { from: location }
            }}
          />
        )
      }
    />
  );
}

export default PrivateRoute;
