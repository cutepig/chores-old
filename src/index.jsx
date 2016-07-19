import React from 'react';
import ReactDOM from 'react-dom';
import firebase from 'firebase';
import {Provider} from './react-firebase';
import App from './app';

const config = {
  apiKey: 'AIzaSyDg0XgimVokGyOIQREFSSUow441WFx5O1w',
  authDomain: 'moneyfunnysonny.firebaseapp.com',
  databaseURL: 'https://moneyfunnysonny.firebaseio.com',
  storageBucket: 'moneyfunnysonny.appspot.com'
};
firebase.initializeApp(config);

const container = document.createElement('div');
container.id = 'app';
document.body.appendChild(container);

ReactDOM.render(
  <Provider firebase={firebase}>
    <App />
  </Provider>,
  container);
