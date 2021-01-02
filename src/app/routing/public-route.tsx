import React from 'react';
import { Route, Redirect, RouteProps } from 'react-router';
import { useSelector } from 'react-redux';
import { amIlogged } from 'app/store/auth/selectors';

namespace PublicRouteNS {
  export interface IProps extends RouteProps {
    path: string;
    isAllowed?: boolean;
    Component: () => JSX.Element;
  }
}

export const PublicRoute = React.memo(({ Component, path, isAllowed = true, ...rest }: PublicRouteNS.IProps) => {
  const isAuthenticated = useSelector(amIlogged);
  return <Route path={path} {...rest} render={() => (!isAuthenticated && isAllowed ? <Component /> : <Redirect to='/chats' />)} />;
});
