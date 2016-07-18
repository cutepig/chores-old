import React, {PropTypes} from 'react';
import ReactDOM from 'react-dom';
import firebase from 'firebase';
import {Provider, authProvider, connect} from './react-firebase';
import * as _ from 'lodash';
import {withState} from 'recompose';

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
      console.log('shouldComponentUpdate', ConditionalRender.displayName);  // eslint-disable-line
      return true;
    }

    render () {
      const {props} = this;

      console.log(ConditionalRender.displayName, predicate(props), props);    // eslint-disable-line
      return predicate(props) ? React.createElement(wrappedComponent, props) : null;
    }
  };

const LoginGoogleButtonView = ({login}) =>
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

const LogoutButtonView = ({logout}) =>
  <button className="logout" onClick={logout}>
    Logout
  </button>;

LogoutButtonView.propTypes = {
  logout: PropTypes.func.isRequired
};

const LogoutButton = connect(null, firebase => ({
  logout: () => firebase.auth().signOut()
}))(LogoutButtonView);

const UserInfoView = ({user}) =>
  <div className="user-info">
    {user
      ? `${user.uid} ${user.displayName}`
      : 'Not logged in'
    }
  </div>;

UserInfoView.propTypes = {
  user: PropTypes.object
};

const UserInfo = authProvider(UserInfoView);

const TaskCard = ({taskId, task}) =>
  <article className="task-card">
    <h1>{task.name}</h1>
    <h2>{task.value}</h2>
    <p>{task.description}</p>
  </article>;

TaskCard.propTypes = {
  taskId: PropTypes.string.isRequired,
  task: PropTypes.object.isRequired
};

const TaskListView = ({tasks}) =>
  <ul className="task-list">
  {_.map(tasks, (task, id) =>
    <li className="task-list__item" key={id}>
      <TaskCard taskId={id} task={task} />
    </li>
  )}
  </ul>;

TaskListView.propTypes = {
  groupId: PropTypes.string,
  tasks: PropTypes.object
};

const TaskList = connect(({groupId}) => ({
  tasks: groupId && `/groups/${groupId}/tasks`
}))(TaskListView);

const GroupSelectView = ({groups, onSelectGroup}) => {
  const onChange = ev => onSelectGroup(ev.currentTarget.value);

  return <div className="group-select">
    <label className="group-select__label">
      Select group
      <select className="group-select__select" defaultValue="" onChange={onChange}>
        <option disabled value="">Select group</option>
        {_.map(groups, (name, id) =>
          <option key={id} value={id}>{name}</option>
        )}
      </select>
    </label>
  </div>;
};

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

const AppPanelView = ({group, setGroup}) => {
  const onSelectGroup = groupId => setGroup(() => groupId);

  return <div className="app-panel">
    <UserInfo />
    <LogoutButton />
    <GroupSelect onSelectGroup={onSelectGroup} />
    <h3>Group ID: {group}</h3>
    <TaskList groupId={group}/>
  </div>;
};

AppPanelView.propTypes = {
  group: PropTypes.string,
  setGroup: PropTypes.func.isRequired
};

const AppPanel = withState('group', 'setGroup', null)(AppPanelView);

const AuthView = _.flowRight(
  authProvider,
  conditionalRender(({user}) => !!user)
)(({children}) => React.Children.only(children));

const NonAuthView = _.flowRight(
  authProvider,
  conditionalRender(({user}) => !user)
)(({children}) => React.Children.only(children));

function App () {
  return <Provider firebase={firebase}>
    <div className="app">
      <AuthView>
        <AppPanel />
      </AuthView>
      <NonAuthView>
        <LoginGoogleButton />
      </NonAuthView>
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
