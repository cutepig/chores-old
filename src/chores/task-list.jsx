import React, {PropTypes} from 'react';
import {mapValues, filter, map} from 'lodash';
import {compose, withHandlers, mapProps} from 'recompose';
import {v4} from 'uuid';
import {connect} from 'refirebase';
import {adminProvider} from 'chores/view-utils';
import TaskCard from 'chores/task-card';

// Fetch a list of tasks and deeds and attach bottom handlers to remove task and create a deed from task
const TaskListConnect = connect(
  ({groupId}, firebase) => ({
    deeds: groupId && `/groups/${groupId}/deeds`,
    tasks: groupId && `/groups/${groupId}/tasks`
  }),
  (firebase, {groupId}) => ({
    // TODO: Also remove the deeds that reference this
    removeTask: taskId =>
      firebase.database().ref(`/groups/${groupId}/tasks/${taskId}`).remove(),
    createDeed: deed =>
      firebase.database().ref(`/groups/${groupId}/deeds/${v4()}`).set(deed)
  }));

// Insert deed information to tasks
const TaskListMapper = ({deeds, tasks, user, ...rest}) => ({
  tasks: mapValues(tasks, (task, taskId) => ({
    ...task,
    // FIXME: pending + done
    pending: filter(deeds, deed => deed.memberId === user.uid && deed.taskId === taskId && !deed.approved),
    approved: filter(deeds, deed => deed.memberId === user.uid && deed.taskId === taskId && !!deed.approved)
  })),
  ...rest
});

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
  isAdmin: PropTypes.bool,
  tasks: PropTypes.object,
  removeTaskFactory: PropTypes.func.isRequired,
  createDeedFactory: PropTypes.func.isRequired
};

const TaskList = compose(
  TaskListConnect,
  adminProvider,
  withHandlers({
    removeTaskFactory: ({removeTask}) => taskId => () =>
      removeTask(taskId),
    // TODO: Make dem damn models and hold id's in the models (and utils!)
    createDeedFactory: ({createDeed, user, tasks}) => taskId => () =>
      createDeed({taskId, memberId: user.uid, value: tasks[taskId].value})
  }),
  mapProps(TaskListMapper)
)(TaskListView);

export default TaskList;
