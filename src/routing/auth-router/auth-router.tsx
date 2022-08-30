import React, { lazy, Suspense } from 'react';

import { Navigate, Route, Routes } from 'react-router-dom';

import { CubeLoader } from '@components/cube-loader';
import { mapRoutes } from '@routing/map-routing';
import { routes } from '@routing/routes/auth-routes';
import { HOME_PAGE_PATH, LOGIN_PAGE_PATH } from '@routing/routing.constants';

const NotFound = lazy(() => import('@pages/not-found/not-found'));

export const AuthRouter: React.FC = () => (
  <Suspense fallback={<CubeLoader />}>
    <Routes>
      {mapRoutes(routes)}
      <Route path={HOME_PAGE_PATH} element={<Navigate to={LOGIN_PAGE_PATH} />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  </Suspense>
);
