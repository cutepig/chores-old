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

const GroupSelectView = ({groups, onSelectGroup}) =>
  <div className="group-select">
    <label className="group-select__label">
      Select group
      <select className="group-select__select" defaultValue="" onChange={onSelectGroup}>
        <option disabled value="">Select group</option>
        {_.map(groups, (name, id) =>
          <option key={id} value={id}>{name}</option>
        )}
      </select>
    </label>
  </div>;

GroupSelectView.propTypes = {
  groups: PropTypes.object,
  onSelectGroup: PropTypes.func.isRequired
};

const GroupSelect = _.flowRight(
  authProvider,
  connect(({user}, firebase) => ({
    groups: user && `/users/${user.uid}/groups`
  }))
)(GroupSelectView);

const User = connect(null, firebase => ({
  login: () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    provider.addScope('profile,email');
    return firebase.auth().signInWithPopup(provider);
  },
  logout: () =>
    firebase.auth().signOut()
}))(authProvider(UserView));

const AuthView = _.flowRight(
  authProvider,
  conditionalRender(({user}) => !!user)
)(({children}) => React.Children.only(children));

function App () {
  return <Provider firebase={firebase}>
    <div className="app">
      <User />
      <AuthView>
        <GroupSelect onSelectGroup={console.log.bind(console, 'onSelectGroup')}/>
      </AuthView>
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
