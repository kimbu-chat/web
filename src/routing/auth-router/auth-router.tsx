import React, { lazy, Suspense } from 'react';

import { Redirect, Route, Switch } from 'react-router-dom';

import { CubeLoader } from '@components/cube-loader';
import { mapRoutes } from '@routing/map-routing';
import { routes } from '@routing/routes/auth-routes';
import { HOME_PAGE_PATH, LOGIN_PAGE_PATH } from '@routing/routing.constants';

const NotFound = lazy(() => import('@pages/not-found/not-found'));

export const AuthRouter: React.FC = () => (
  <Suspense fallback={<CubeLoader />}>
    <Switch>
      {mapRoutes(routes)}
      <Route exact path={HOME_PAGE_PATH}>
        <Redirect to={LOGIN_PAGE_PATH} />
      </Route>
      <Route component={NotFound} />
    </Switch>
  </Suspense>
);
