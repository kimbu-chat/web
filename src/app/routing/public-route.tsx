import React from 'react';
import { Route, Redirect, RouteProps } from 'react-router';

namespace PrivateRouteNS {
  export interface IProps extends RouteProps {
    Component: JSX.Element;
    path: string;
    isAllowed: boolean;
    fallback?: string;
  }
}

export const PrivateRoute = React.memo(({ Component, path, fallback, isAllowed, ...rest }: PrivateRouteNS.IProps) => (
  <Route
    path={path}
    {...rest}
    render={({ location }) =>
      isAllowed ? (
        Component
      ) : (
        <Redirect
          to={{
            pathname: fallback,
            state: { from: location },
          }}
        />
      )
    }
  />
));
