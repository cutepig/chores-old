import React from 'react';
import ReactDOM from 'react-dom';
import firebase from 'firebase';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from 'react-tap-event-plugin';
import {Provider} from 'refirebase';
import App from 'chores/app';

const config = {
  apiKey: 'AIzaSyDg0XgimVokGyOIQREFSSUow441WFx5O1w',
  authDomain: 'moneyfunnysonny.firebaseapp.com',
  databaseURL: 'https://moneyfunnysonny.firebaseio.com',
  storageBucket: 'moneyfunnysonny.appspot.com'
};
firebase.initializeApp(config);

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

ReactDOM.render(
  <Provider firebase={firebase}>
    <MuiThemeProvider>
      <App />
    </MuiThemeProvider>
  </Provider>,
  document.getElementById('app'));
