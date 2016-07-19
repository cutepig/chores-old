import React, {PropTypes} from 'react';
import {withState} from 'recompose';
import UserInfo from 'chores/user-info';
import LogoutButton from 'chores/logout-button';
import GroupSelect from 'chores/group-select';
import TaskList from 'chores/task-list';
import DeedList from 'chores/deed-list';
import {AdminView} from 'chores/view-utils';
import AdminPanel from 'chores/admin-panel';

export const AppPanelView = ({group, setGroup}) =>
  <div className="app-panel">
    <UserInfo />
    <LogoutButton />
    <GroupSelect onSelectGroup={setGroup} />
    <h3>Group ID: {group}</h3>
    <h4>Tasks:</h4>
    <TaskList groupId={group} />
    <h4>Deeds:</h4>
    <DeedList groupId={group} />
    <AdminView groupId={group}>
      <AdminPanel groupId={group} />
    </AdminView>
  </div>;

AppPanelView.propTypes = {
  group: PropTypes.string,
  setGroup: PropTypes.func.isRequired
};

const AppPanel = withState('group', 'setGroup', null)(AppPanelView);

export default AppPanel;
