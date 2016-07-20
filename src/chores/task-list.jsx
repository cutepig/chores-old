import React, {PropTypes} from 'react';
import {map} from 'lodash';
import {connect} from 'refirebase';
import {compose, adminProvider} from 'chores/view-utils';
import TaskCard from 'chores/task-card';

export const TaskListView = ({groupId, isAdmin, tasks}) =>
  <ul className="task-list">
  {map(tasks, (task, id) =>
    <li className="task-list__item" key={id}>
      <TaskCard isAdmin={isAdmin} taskId={id} task={task} />
    </li>
  )}
  </ul>;

TaskListView.propTypes = {
  groupId: PropTypes.string,
  isAdmin: PropTypes.boolean,
  tasks: PropTypes.object
};

const TaskList = compose(
  connect(({groupId}) => ({
    tasks: groupId && `/groups/${groupId}/tasks`
  })),
  adminProvider
)(TaskListView);

export default TaskList;
