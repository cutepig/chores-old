import React, {PropTypes} from 'react';

export const TaskCard = ({taskId, task}) =>
  <article className="task-card">
    <h1>{task.name}</h1>
    <h2>{task.value}</h2>
    <p>{task.description}</p>
  </article>;

TaskCard.propTypes = {
  taskId: PropTypes.string.isRequired,
  task: PropTypes.object.isRequired
};

export default TaskCard;
