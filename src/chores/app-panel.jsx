import React, {PropTypes} from 'react';
import {get, pickBy} from 'lodash';
import {compose, withState, mapProps} from 'recompose';
import {connect} from 'refirebase';
import UserInfo from 'chores/user-info';
import LogoutButton from 'chores/logout-button';
import GroupSelect from 'chores/group-select';
import Earnings from 'chores/earnings';
import TaskList from 'chores/task-list';
import DeedList from 'chores/deed-list';
import AdminPanel from 'chores/admin-panel';

export const AppPanelConnect = connect(({groupId}) => ({
  group: groupId && `/groups/${groupId}`
}));

export const AppPanelMapper = props => {
  const {user, member, group} = props;
  return {
    groups: get(member, 'groups', {}),
    tasks: get(group, 'tasks', {}),
    deeds: pickBy(get(group, 'deeds', {}), deed => !deed.archived),
    isAdmin: user && get(group, ['members', user.uid, 'isAdmin'], false),
    ...props
  };
};

export const AppPanelView = ({groupId, group, user, member, isAdmin, groups, tasks, deeds, setGroup}) =>
  <div className="app-panel">
    <UserInfo user={user} />
    <LogoutButton />
    <GroupSelect groups={get(member, 'groups')} onSelectGroup={setGroup} />
    {group &&
      <div className="app-panel__group">
        <h3>{get(group, 'name')} ({groupId})</h3>
        <h4>Earnings</h4>
        <Earnings user={user} tasks={tasks} deeds={deeds} />
        <TaskList user={user} isAdmin={isAdmin} groupId={groupId} tasks={tasks} deeds={deeds} />
        {isAdmin && <AdminPanel groupId={groupId} />}
        <h4>Deeds:</h4>
        <DeedList user={user} isAdmin={isAdmin} groupId={groupId} tasks={tasks} deeds={deeds} />
      </div>
    }
  </div>;
/*
<AdminView groupId={group}>
  <AdminPanel groupId={group} />
</AdminView>
*/
AppPanelView.propTypes = {
  groupId: PropTypes.string,
  group: PropTypes.object,
  user: PropTypes.object,
  member: PropTypes.object,
  isAdmin: PropTypes.bool.isRequired,
  groups: PropTypes.object.isRequired,
  tasks: PropTypes.object.isRequired,
  deeds: PropTypes.object.isRequired,
  setGroup: PropTypes.func.isRequired
};

const AppPanel = compose(
  withState('groupId', 'setGroup', null),
  AppPanelConnect,
  mapProps(AppPanelMapper)
)(AppPanelView);

export default AppPanel;
