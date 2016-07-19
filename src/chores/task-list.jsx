import React, {PropTypes} from 'react';
import {map} from 'lodash';
import {connect} from 'refirebase';
import TaskCard from 'chores/task-card';

export const TaskListView = ({tasks}) =>
  <ul className="task-list">
  {map(tasks, (task, id) =>
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

export default TaskList;
