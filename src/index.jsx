import React, {PropTypes} from 'react';
import ReactDOM from 'react-dom';
import firebase from 'firebase';
import {Provider, authProvider, connect} from './react-firebase';
import * as _ from 'lodash';

const config = {
  apiKey: 'AIzaSyDg0XgimVokGyOIQREFSSUow441WFx5O1w',
  authDomain: 'moneyfunnysonny.firebaseapp.com',
  databaseURL: 'https://moneyfunnysonny.firebaseio.com',
  storageBucket: 'moneyfunnysonny.appspot.com'
};
firebase.initializeApp(config);

const GroupsView = ({groups}) =>
  <div className="groups">
    <ul className="groups__list">
      {_.map(groups, (group, id) =>
        <li className="groups__list__item" key={id}>
          {`${id}:  ${group.name}`}
        </li>
      )}
    </ul>
  </div>;

GroupsView.propTypes = {
  groups: PropTypes.object
};

const UserView = ({user, login, logout}) =>
  <div className="user">
    {user
      ? `${user.uid} ${user.displayName}`
      : 'Not logged in'
    }
    {user
      ? <button className="user__logout" onClick={logout}>Logout</button>
      : <button className="user__login" onClick={login}>Login</button>
    }
  </div>;

UserView.propTypes = {
  user: PropTypes.object,
  login: PropTypes.func.isRequired,
  logout: PropTypes.func.isRequired
};

const User = connect(null, firebase => ({
  login: () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    provider.addScope('profile,email');
    return firebase.auth().signInWithPopup(provider);
  },
  logout: () =>
    firebase.auth().signOut()
}))(authProvider(UserView));

const Groups = connect({
  groups: '/groups'
})(GroupsView);

function App () {
  return <Provider firebase={firebase}>
    <div className="app">
      <User />
      <Groups />
    </div>
  </Provider>;
};

App.propTypes = {
  children: PropTypes.node
};

const container = document.createElement('div');
container.id = 'app';
document.body.appendChild(container);

ReactDOM.render(
  <App />,
  container);
