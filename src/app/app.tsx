import React from 'react';
import { Switch, Route } from 'react-router';
import LoginPage from './containers/Login/LoginPage';
import Messenger from './containers/Messenger/Messenger';
import './base.scss';

import PrivateRoute from './utils/PrivateRoute';
import PublicRoute from './utils/PublicRoute';

export const App = () => (
  <Switch>
    <PrivateRoute path="/chats/:id?" Component={Messenger} />
    <PublicRoute path="/login" Component={LoginPage} />
    <Route>
      <div className="">404</div>
    </Route>
  </Switch>
);
