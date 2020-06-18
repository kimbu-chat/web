import React from 'react';
import { Route, Switch } from 'react-router';
import LoginPage from './containers/Login/LoginPage';
import Messenger from './containers/Messenger/Messenger';
import './base.scss';

export const App = () => (
  <Switch>
    <Route path="/messenger" component={Messenger} />
    <Route component={LoginPage} />
  </Switch>
);
