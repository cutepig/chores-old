import React, {PropTypes} from 'react';
import {connect} from 'refirebase';

// TODO: Are you sure dialog when removing the task
// TODO: Move removeTask logic (and groupId) back to TaskList
// TODO: Also make dem damn models and hold id's in the models
export const TaskCardView = ({taskId, task, isAdmin, removeTask}) =>
  <article className="task-card">
    <h1>{task.name}</h1>
    <h2>{task.value}</h2>
    <p>{task.description}</p>
    {isAdmin && <button onClick={removeTask}>Remove</button>}
  </article>;

TaskCardView.propTypes = {
  taskId: PropTypes.string.isRequired,
  task: PropTypes.object.isRequired,
  isAdmin: PropTypes.bool,
  removeTask: PropTypes.func.isRequired
};

const TaskCard = connect(null, (firebase, {groupId, taskId}) => ({
  removeTask: () =>
    firebase.database().ref(`/groups/${groupId}/tasks/${taskId}`).remove()
}))(TaskCardView);
export default TaskCard;
