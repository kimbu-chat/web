import React from 'react';
import { Route, Redirect, RouteProps } from 'react-router';
import { useSelector } from 'react-redux';
import { authenticatedSelector } from '@store/auth/selectors';

interface IPublicRouteProps extends RouteProps {
  path: string;
  isAllowed?: boolean;
  componentToRender: JSX.Element;
}

export const PublicRoute: React.FC<IPublicRouteProps> = React.memo(
  ({ componentToRender, path, isAllowed = true, ...rest }) => {
    const isAuthenticated = useSelector(authenticatedSelector);
    return (
      <Route
        path={path}
        {...rest}
        render={() =>
          !isAuthenticated && isAllowed ? componentToRender : <Redirect to="/chats" />
        }
      />
    );
  },
);
