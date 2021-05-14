import React from 'react';
import { Route, Switch, Redirect } from 'react-router';

import { SettingsNavigation } from '@pages/settings/settings-navigation';
import { EditProfile } from '@pages/settings/edit-profile';
import { NotificationsSettings } from '@pages/settings/notifications-settings';
import { LanguageSettings } from '@pages/settings/language-settings';
import { KeyBindings } from '@pages/settings/key-bindings';
import { Appearance } from '@pages/settings/appearance';
import { PrivacySecurity } from '@pages/settings/privacy-security';
import { AudioVideoSettings } from '@pages/settings/audio-video';

import './settings-router.scss';

const BLOCK_NAME = 'settings-router';

export const SettingsRouter: React.FC = () => (
  <>
    <div className={`${BLOCK_NAME}__navigation`}>
      <SettingsNavigation />
    </div>
    <div className={`${BLOCK_NAME}__data`}>
      <Switch>
        <Route exact path="/settings/profile">
          <EditProfile />
        </Route>

        <Route exact path="/settings/notifications">
          <NotificationsSettings />
        </Route>

        <Route exact path="/settings/language">
          <LanguageSettings />
        </Route>

        <Route exact path="/settings/typing">
          <KeyBindings />
        </Route>

        <Route exact path="/settings/appearance">
          <Appearance />
        </Route>

        <Route exact path="/settings/privacy-security">
          <PrivacySecurity />
        </Route>

        <Route exact path="/settings/audio-video">
          <AudioVideoSettings />
        </Route>

        <Route>
          <Redirect to="/settings/profile" />
        </Route>
      </Switch>
    </div>
  </>
);
