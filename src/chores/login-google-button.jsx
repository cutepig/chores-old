import React, {PropTypes} from 'react';
import {connect} from 'refirebase';

export const LoginGoogleButtonView = ({login}) =>
  <button className="login-google" onClick={login}>
    Login with Google
  </button>;

LoginGoogleButtonView.propTypes = {
  login: PropTypes.func.isRequired
};

const LoginGoogleButton = connect(null, firebase => ({
  login: () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    provider.addScope('profile,email');
    return firebase.auth().signInWithPopup(provider);
  }
}))(LoginGoogleButtonView);

export default LoginGoogleButton;
