import React from 'react';
import { Route, Switch } from 'react-router';
import { LoginPage } from './components';
import './base.scss';

export const App = () => (
  <Switch>
    <Route path="/" component={LoginPage} />
  </Switch>
);
