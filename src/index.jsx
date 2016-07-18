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

const conditionalRender = predicate => wrappedComponent =>
  class ConditionalRender extends React.Component {
    static get displayName () {
      return `ConditionalRender(${wrappedComponent.displayName || wrappedComponent.name})`;
    }

    shouldComponentUpdate () {
      console.log('shouldComponentUpdate', ConditionalRender.displayName);
      return true;
    }

    render () {
      const {props} = this;

      console.log(ConditionalRender.displayName, predicate(props), props);
      return predicate(props) ? React.createElement(wrappedComponent, props) : null;
    }
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

const UserGroupsView = ({groups}) => {
  console.log('UserGroupsView', groups);
  return <div className="user-groups">
    <ul className="user-groups__list">
    {_.map(groups, (name, id) =>
      <li key={id}>{name}</li>
    )}
    </ul>
  </div>;
}

UserGroupsView.propTypes = {
  user: PropTypes.object.isRequired,
  groups: PropTypes.object
};

const UserGroups = _.flowRight(
  authProvider,
  conditionalRender(({user}) => !!user),
  connect(({user}) => ({
    groups: user && `/users/${user.uid}/groups`
  }))
)(UserGroupsView);

const User = connect(null, firebase => ({
  login: () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    provider.addScope('profile,email');
    return firebase.auth().signInWithPopup(provider);
  },
  logout: () =>
    firebase.auth().signOut()
}))(authProvider(UserView));

function App () {
  return <Provider firebase={firebase}>
    <div className="app">
      <User />
      <UserGroups />
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
