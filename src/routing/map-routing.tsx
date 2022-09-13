import React from 'react';

import { Route } from 'react-router-dom';

import type { RouteObject } from './routing.types';

export const mapRoutes = (routes: RouteObject[]) =>
  routes.map((route) => {
    const {
      path,
      props: { element: PageComponent, ...props },
    } = route;

    return <Route key={path} path={path} element={<PageComponent />} {...props} />;
  });
