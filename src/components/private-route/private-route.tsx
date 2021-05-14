import React from 'react';
import { Route, Redirect, RouteProps } from 'react-router';

interface IPrivateRouteProps extends RouteProps {
  path: string;
  isAllowed: boolean;
  fallback: string;
  componentToRender: JSX.Element;
}

export const PrivateRoute: React.FC<IPrivateRouteProps> = ({
  componentToRender,
  path,
  fallback,
  isAllowed,
  ...rest
}) => (
  <Route
    path={path}
    {...rest}
    render={() => (isAllowed ? componentToRender : <Redirect to={fallback} />)}
  />
);
