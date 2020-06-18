import React from 'react';
import { Route, Switch } from 'react-router';
import LoginPage from './components/LoginPage/LoginPage';
import './base.scss';

export const App = () => (
  <Switch>
    <Route component={LoginPage} />
  </Switch>
);
