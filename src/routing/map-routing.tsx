import React from 'react';
import { Route } from 'react-router-dom';

import type { RouteObject } from './routing.types';

export const mapRoutes = (routes: RouteObject[]) =>
  routes.map((route) => {
    const {
      path,
      props: { component: PageComponent, ...props },
    } = route;

    return <Route key={path} path={path} component={PageComponent} {...props} />;
  });
