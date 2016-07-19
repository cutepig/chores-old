import React, {PropTypes} from 'react';
import {connect} from 'refirebase';

export const LogoutButtonView = ({logout}) =>
  <button className="logout" onClick={logout}>
    Logout
  </button>;

LogoutButtonView.propTypes = {
  logout: PropTypes.func.isRequired
};

const LogoutButton = connect(null, firebase => ({
  logout: () => firebase.auth().signOut()
}))(LogoutButtonView);

export default LogoutButton;
