import React from 'react';

import { Routes, Navigate, Route } from 'react-router-dom';

import { AppVersion } from '@components/app-version';
import { SettingsNavigation } from '@pages/settings/settings-navigation';
import { mapRoutes } from '@routing/map-routing';
import { routes } from '@routing/routes/settings-routes';

import './settings-router.scss';

const BLOCK_NAME = 'settings-router';

const SettingsRouter: React.FC = () => (
  <>
    <div className={`${BLOCK_NAME}__navigation`}>
      <SettingsNavigation />
      <AppVersion className={`${BLOCK_NAME}__app-version`} />
    </div>
    <div className={`${BLOCK_NAME}__data`}>
      <Routes>
        <Route path="" element={<Navigate to="profile" />} />
        {mapRoutes(routes)}
      </Routes>
    </div>
  </>
);

export default SettingsRouter;
