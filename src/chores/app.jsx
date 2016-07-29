import React, {PropTypes} from 'react';
import {compose} from 'recompose';
import {connect, authProvider} from 'refirebase';
import LoginGoogleButton from 'chores/login-google-button';
import AppPanel from 'chores/app-panel';

// TODO: Fetch user and groups

const AppConnect = connect(({user}) => ({
  member: user && `/users/${user.uid}`
}));

export const AppView = ({user, member}) =>
  <div className="app">
    {user && member
      ? <AppPanel user={user} member={member} />
      : <LoginGoogleButton />
    }
  </div>;

AppView.propTypes = {
  user: PropTypes.object,
  member: PropTypes.object
};

const App = compose(
  authProvider,
  AppConnect
)(AppView);

export default App;
