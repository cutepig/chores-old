import React, {PropTypes} from 'react';
import {Card, CardTitle, CardText, CardActions, Button} from 'react-mdl';
import {get} from 'lodash';

export const TaskCard = ({task, isAdmin, removeTask, createDeed}) =>
  <Card className="task-card" shadow={1}>
    <CardTitle>
      <h4 className="task-card__title">
        {get(task, 'name')}&nbsp;
        <small>{get(task, 'value')} €</small>
      </h4>
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
      <Button onTouchTap={createDeed}>
        Tehty
      </Button>
      {isAdmin &&
        <Button accent onTouchTap={removeTask}>
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
