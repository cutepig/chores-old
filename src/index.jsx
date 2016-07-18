import React, {PropTypes} from 'react';
import ReactDOM from 'react-dom';
import firebase from 'firebase';
import {Provider, connect} from './react-firebase';
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

const UserView = ({user}) =>
  <div className="user">
    {user
      ? `${user.uid} ${user.displayName}`
      : 'No user'
    }
  </div>;

UserView.propTypes = {
  user: PropTypes.object
};

const User = connect(null, firebase => ({
  user: firebase.auth().currentUser
}))(UserView);

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
