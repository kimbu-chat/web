import { lazy } from 'react';
import { matchPath } from 'react-router-dom';

import type { ImportStatement, PreloadableComponent, RouteObject } from './routing.types';

const preloaded: string[] = [];

export const LazyPreload = (importStatement: ImportStatement): PreloadableComponent => {
  const Component = lazy(importStatement) as PreloadableComponent;
  Component.preload = importStatement;
  return Component;
};

export const findComponentForRoute = (path: string, routes: RouteObject[]): any => {
  const matchingRoute = routes.find((route) =>
    matchPath(path, {
      path: route.path,
      exact: route.props.exact,
    }),
  );

  return matchingRoute ? matchingRoute.props.component : undefined;
};

export const preloadRouteComponent = (path: string, routes: RouteObject[]): void => {
  if (preloaded.indexOf(path) !== -1) {
    return;
  }
  const component = findComponentForRoute(path, routes);
  if (component && component.preload) {
    component.preload();
    preloaded.push(path);
  }
};
