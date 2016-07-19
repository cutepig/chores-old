import React, {PropTypes} from 'react';
import LoginGoogleButton from './login-google-button';
import AppPanel from './app-panel';
import {AuthView, NonAuthView} from './view-utils';

export const App = () =>
  <div className="app">
    <AuthView>
      <AppPanel />
    </AuthView>
    <NonAuthView>
      <LoginGoogleButton />
    </NonAuthView>
  </div>;

App.propTypes = {
  children: PropTypes.node
};

export default App;
