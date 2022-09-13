import React, { useEffect, lazy, useLayoutEffect } from 'react';

import { useDispatch } from 'react-redux';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';

import { RoutingChats } from '@components/routing-chats';
import { mapRoutes } from '@routing/map-routing';
import { preloadAllSkipActual } from '@routing/preloading.utils';
import { routes } from '@routing/routes/main-routes';
import { routes as settingsRoutes } from '@routing/routes/settings-routes';
import { HOME_PAGE_PATH, INSTANT_MESSAGING_PATH } from '@routing/routing.constants';
import { store, StoreKeys } from '@store';
import { AppInit } from '@store/initiation/features/app-init/app-init';

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

  useLayoutEffect(() => {
    preloadAllSkipActual(location.pathname, [...routes, ...settingsRoutes]);
  }, [location.pathname]);

  return (
    <div className="messenger">
      <Call />
      {/* TODO: FIX THIS LATER!!! */}
      {/* {!internetState && <InternetError />} */}
      <RoutingChats />
      <Routes>
        {mapRoutes(routes)}
        <Route path={HOME_PAGE_PATH} element={<Navigate to={INSTANT_MESSAGING_PATH} />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
};

MainRouter.displayName = 'MainRouter';

export default MainRouter;
