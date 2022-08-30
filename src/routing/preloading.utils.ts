import { lazy } from 'react';

import forEach from 'lodash/forEach';
import invoke from 'lodash/invoke';
import { matchPath } from 'react-router-dom';

import type { ImportStatement, PreloadableComponent, RouteObject } from './routing.types';

const preloaded: string[] = [];
const preloadedFromPaths: string[] = [];

/**
 *
 * @param importStatement callback that returns import statement. ex. import('/path/to/my/component')
 * @returns preloadable component with 'preload' functionality. ex. MyComponent.preload()
 */
export const LazyPreload = (importStatement: ImportStatement): PreloadableComponent => {
  const Component = lazy(importStatement) as PreloadableComponent;
  Component.preload = importStatement;
  return Component;
};

/**
 *
 * @param path path to route to find
 * @param routes the list of routes where to search
 * @returns matching route or undefined
 */
export const findComponentForRoute = (path: string, routes: RouteObject[]): any => {
  const matchingRoute = routes.find((route) => matchPath(path, route.path));

  return matchingRoute ? matchingRoute.props.element : undefined;
};

/**
 *
 * @param path path to route to be preloaded
 * @param routes the list of routes where to find preloadable route
 * @returns void
 */
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

/**
 *
 * @param path actual route path
 * @param routes the list of routes to be preloaded
 * @returns void
 */
export const preloadAllSkipActual = (path: string, routes: RouteObject[]): void => {
  if (preloadedFromPaths.indexOf(path) !== -1) {
    return;
  }
  preloadedFromPaths.push(path);
  forEach(routes, (route) => {
    if (preloaded.indexOf(route.path) !== -1) {
      return;
    }
    invoke(route.props.element, 'preload');
    preloaded.push(route.path);
  });
};
