import React, {PropTypes} from 'react';
import LoginGoogleButton from 'chores/login-google-button';
import AppPanel from 'chores/app-panel';
import {AuthView, NonAuthView} from 'chores/view-utils';

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
