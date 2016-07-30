import React, {PropTypes} from 'react';
import {Button} from 'react-mdl';
import {connect} from 'refirebase';

export const LoginGoogleButtonView = ({login}) =>
  <Button raised className="login-google-button" onClick={login}>
    <div className="login-google-button__logo"></div>
    <div className="login-google-button__text">Sign in with Google</div>
  </Button>;

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
