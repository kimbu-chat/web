import React from 'react';
import { Route, Redirect, RouteProps } from 'react-router';

namespace PrivateRouteNS {
  export interface IProps extends RouteProps {
    path: string;
    isAllowed: boolean;
    fallback: string;
    Component: () => JSX.Element;
  }
}

export const PrivateRoute = React.memo(({ Component, path, fallback, isAllowed, ...rest }: PrivateRouteNS.IProps) => (
  <Route path={path} {...rest} render={() => (isAllowed ? <Component /> : <Redirect to={fallback!} />)} />
));
