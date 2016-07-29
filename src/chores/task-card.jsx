import React, {PropTypes} from 'react';

export const TaskCard = ({task, isAdmin, removeTask, createDeed}) =>
  <article className="task-card">
    <h1>{task.name}</h1>
    <h2>{task.value}</h2>
    <ul>
      <li><b>Approved: </b>{task.approved.length}</li>
      <li><b>Pending: </b>{task.pending.length}</li>
    </ul>
    <p>{task.description}</p>
    <button onClick={createDeed}>I did this!</button>
    {isAdmin && <button onClick={removeTask}>Remove</button>}
  </article>;

TaskCard.propTypes = {
  task: PropTypes.object.isRequired,
  isAdmin: PropTypes.bool,
  removeTask: PropTypes.func.isRequired,
  createDeed: PropTypes.func.isRequired
};

export default TaskCard;
