import React, {PropTypes} from 'react';
import {connect} from 'refirebase';

// TODO: Are you sure dialog when removing the task
// TODO: Move removeTask logic (and groupId) back to TaskList
export const TaskCardView = ({taskId, task, removeTask}) =>
  <article className="task-card">
    <h1>{task.name}</h1>
    <h2>{task.value}</h2>
    <p>{task.description}</p>
    <button onClick={removeTask}>Remove</button>
  </article>;

TaskCardView.propTypes = {
  groupId: PropTypes.string.isRequired,
  taskId: PropTypes.string.isRequired,
  task: PropTypes.object.isRequired,
  removeTask: PropTypes.func.isRequired
};

const TaskCard = connect(null, (firebase, {groupId, taskId}) => ({
  removeTask: () =>
    firebase.database().ref(`/groups/${groupId}/tasks/${taskId}`).remove()
}))(TaskCardView);
export default TaskCard;
