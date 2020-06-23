import React from 'react';
import { Switch } from 'react-router';
import LoginPage from './containers/Login/LoginPage';
import Messenger from './containers/Messenger/Messenger';
import './base.scss';

import PrivateRoute from './utils/PrivateRoute';
import PublicRoute from './utils/PublicRoute';

export const App = () => (
  <Switch>
    <PrivateRoute path="/messenger" component={<Messenger />} />
    <PublicRoute path="/" component={<LoginPage />} />
  </Switch>
);
