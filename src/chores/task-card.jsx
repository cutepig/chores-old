import React, {PropTypes} from 'react';
import {Card, CardTitle, CardText, CardActions, Button} from 'react-mdl';
import {get} from 'lodash';

export const TaskCard = ({task, isAdmin, removeTask, createDeed}) =>
  <Card className="task-card" shadow={1}>
    <CardTitle className="task-card__header">
      {get(task, 'name')}&nbsp;
      <small>{get(task, 'value')} €</small>
    </CardTitle>
    <CardText className="task-card__status">
      <div className="task-card__status__approved">
        {task.approved.length}
      </div>
      <div className="task-card__status__pending">
        {task.pending.length}
      </div>
    </CardText>
    <CardText>{task.description}</CardText>
    <CardActions>
      <Button ripple onClick={createDeed}>
        Tehty
      </Button>
      {isAdmin &&
        <Button accent ripple onClick={removeTask}>
          Poista
        </Button>
      }
    </CardActions>
  </Card>;

TaskCard.propTypes = {
  task: PropTypes.object.isRequired,
  isAdmin: PropTypes.bool,
  removeTask: PropTypes.func.isRequired,
  createDeed: PropTypes.func.isRequired
};

export default TaskCard;
