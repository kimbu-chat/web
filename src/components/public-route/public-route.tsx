import React from 'react';
import { Route, Redirect, RouteProps } from 'react-router';

interface IPublicRouteProps extends RouteProps {
  path: string;
  isAllowed?: boolean;
  componentToRender: JSX.Element;
}

const PublicRoute: React.FC<IPublicRouteProps> = ({
  componentToRender,
  path,
  isAllowed = true,
  ...rest
}) => (
  <Route
    path={path}
    {...rest}
    render={() => (isAllowed ? componentToRender : <Redirect to="/chats" />)}
  />
);
PublicRoute.displayName = 'PublicRoute';

export { PublicRoute };
