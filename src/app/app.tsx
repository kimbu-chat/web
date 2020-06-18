import React from 'react';
import { Route, Switch } from 'react-router';
import LoginPage from './containers/Login/LoginPage';
import './base.scss';

export const App = () => (
  <Switch>
    <Route component={LoginPage} />
  </Switch>
);
