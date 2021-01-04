import React from 'react';
import { Route, Redirect, RouteProps } from 'react-router';

interface IPrivateRouteProps extends RouteProps {
  path: string;
  isAllowed: boolean;
  fallback: string;
  Component: () => JSX.Element;
}

export const PrivateRoute: React.FC<IPrivateRouteProps> = React.memo(({ Component, path, fallback, isAllowed, ...rest }) => (
  <Route path={path} {...rest} render={() => (isAllowed ? <Component /> : <Redirect to={fallback!} />)} />
));
