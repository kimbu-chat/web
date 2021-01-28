import React from 'react';
import { Route, Redirect, RouteProps } from 'react-router';
import { useSelector } from 'react-redux';
import { amIAuthenticatedSelector } from 'app/store/auth/selectors';

interface IPublicRouteProps extends RouteProps {
  path: string;
  isAllowed?: boolean;
  componentToRender: JSX.Element;
}

export const PublicRoute: React.FC<IPublicRouteProps> = React.memo(({ componentToRender, path, isAllowed = true, ...rest }) => {
  const isAuthenticated = useSelector(amIAuthenticatedSelector);
  return <Route path={path} {...rest} render={() => (!isAuthenticated && isAllowed ? componentToRender : <Redirect to='/chats' />)} />;
});
