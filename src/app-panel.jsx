import React, {PropTypes} from 'react';
import {withState} from 'recompose';
import UserInfo from './user-info';
import LogoutButton from './logout-button';
import GroupSelect from './group-select';
import TaskList from './task-list';
import DeedList from './deed-list';

export const AppPanelView = ({group, setGroup}) => {
  const onSelectGroup = groupId => setGroup(() => groupId);

  return <div className="app-panel">
    <UserInfo />
    <LogoutButton />
    <GroupSelect onSelectGroup={onSelectGroup} />
    <h3>Group ID: {group}</h3>
    <h4>Tasks:</h4>
    <TaskList groupId={group} />
    <h4>Deeds:</h4>
    <DeedList groupId={group} />
  </div>;
};

AppPanelView.propTypes = {
  group: PropTypes.string,
  setGroup: PropTypes.func.isRequired
};

const AppPanel = withState('group', 'setGroup', null)(AppPanelView);

export default AppPanel;
