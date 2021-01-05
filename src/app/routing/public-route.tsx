import React from 'react';
import { Route, Redirect, RouteProps } from 'react-router';
import { useSelector } from 'react-redux';
import { amILoggedSelector } from 'app/store/auth/selectors';

interface IPublicRouteProps extends RouteProps {
  path: string;
  isAllowed?: boolean;
  Component: () => JSX.Element;
}

export const PublicRoute: React.FC<IPublicRouteProps> = React.memo(({ Component, path, isAllowed = true, ...rest }) => {
  const isAuthenticated = useSelector(amILoggedSelector);
  return <Route path={path} {...rest} render={() => (!isAuthenticated && isAllowed ? <Component /> : <Redirect to='/chats' />)} />;
});
