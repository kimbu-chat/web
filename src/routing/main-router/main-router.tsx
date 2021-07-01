import React, { useEffect, lazy, useLayoutEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Redirect, Route, Switch, useLocation } from 'react-router-dom';

import { store, StoreKeys } from '@store';
import { RoutingChats } from '@components/routing-chats';
import { AppInit } from '@store/initiation/features/app-init/app-init';
import { routes } from '@routing/routes/main-routes';
import { routes as settingsRoutes } from '@routing/routes/settings-routes';
import { mapRoutes } from '@routing/map-routing';
import { HOME_PAGE_PATH, INSTANT_MESSAGING_PATH } from '@routing/routing.constants';
import { preloadAllSkipActual } from '@routing/preloading.utils';

import './main-router.scss';

const Call = lazy(async () => {
  const callModule = await import('@store/calls/module');
  store.inject([[StoreKeys.CALLS, callModule.reducer, callModule.callsSaga]]);
  return import('@pages/call/call');
});

const NotFound = lazy(() => import('@pages/not-found/not-found'));

const MainRouter: React.FC = () => {
  const dispatch = useDispatch();

  const location = useLocation();

  useEffect(() => {
    dispatch(AppInit.action());
  }, [dispatch]);

  useLayoutEffect(
    () => preloadAllSkipActual(location.pathname, [...routes, ...settingsRoutes]),
    [location.pathname],
  );

  return (
    <div className="messenger">
      <Call />
      {/* TODO: FIX THIS LATER!!! */}
      {/* {!internetState && <InternetError />} */}
      <RoutingChats />
      <Switch>
        {mapRoutes(routes)}
        <Route path={HOME_PAGE_PATH}>
          <Redirect to={INSTANT_MESSAGING_PATH} />
        </Route>
        <Route component={NotFound} />
      </Switch>
    </div>
  );
};

MainRouter.displayName = 'MainRouter';

export default MainRouter;
