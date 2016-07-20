import React, {PropTypes} from 'react';
import {map} from 'lodash';
import {compose, withHandlers} from 'recompose';
import {v4} from 'uuid';
import {connect} from 'refirebase';
import {adminProvider} from 'chores/view-utils';
import TaskCard from 'chores/task-card';

export const TaskListView = ({groupId, isAdmin, tasks, removeTaskFactory, createDeedFactory}) =>
  <ul className="task-list">
  {map(tasks, (task, id) =>
    <li className="task-list__item" key={id}>
      <TaskCard isAdmin={isAdmin} task={task} removeTask={removeTaskFactory(id)} createDeed={createDeedFactory(id)} />
    </li>
  )}
  </ul>;

TaskListView.propTypes = {
  groupId: PropTypes.string,
  isAdmin: PropTypes.boolean,
  tasks: PropTypes.object,
  removeTaskFactory: PropTypes.func.isRequired,
  createDeedFactory: PropTypes.func.isRequired
};

const TaskList = compose(
  adminProvider,
  connect(({groupId}) => ({
    tasks: groupId && `/groups/${groupId}/tasks`
  }), (firebase, {groupId}) => ({
    removeTask: taskId =>
      firebase.database().ref(`/groups/${groupId}/tasks/${taskId}`).remove(),
    createDeed: deed =>
      firebase.database().ref(`/groups/${groupId}/deeds/${v4()}`).set(deed)
  })),
  withHandlers({
    removeTaskFactory: ({removeTask}) => taskId => () =>
      removeTask(taskId),
    // TODO: Make dem damn models and hold id's in the models (and utils!)
    createDeedFactory: ({createDeed, user}) => taskId => () =>
      createDeed({taskId, memberId: user.uid})
  })
)(TaskListView);

export default TaskList;
