import React, {PropTypes} from 'react';
import {Button} from 'react-mdl';
import {connect} from 'refirebase';

export const LogoutButtonView = ({logout}) =>
  <Button className="logout" onClick={logout}>
    Logout
  </Button>;

LogoutButtonView.propTypes = {
  logout: PropTypes.func.isRequired
};

const LogoutButton = connect(null, firebase => ({
  logout: () => firebase.auth().signOut()
}))(LogoutButtonView);

export default LogoutButton;
