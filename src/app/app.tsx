import React from 'react';
import { Route, Switch } from 'react-router';
import LoginPage from './components/LoginPage/LoginPage';
import './base.scss';

import { Register } from './TEMP/TEMP';

export const App = () => (
  <Switch>
    <Route path="/register" component={Register} />
    <Route path="/login" component={LoginPage} />
  </Switch>
);
