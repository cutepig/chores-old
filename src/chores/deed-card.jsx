import React, {PropTypes} from 'react';
import {Card, CardTitle, CardText, CardActions, Button} from 'react-mdl';
import {get} from 'lodash';

export const DeedCard = ({deed, isAdmin, approveDeed}) =>
  <Card className="deed-card" shadow={1}>
    <CardTitle>
      <h4 className="deed-card__title">
        {get(deed, ['task', 'name'])}&nbsp;
        <small>
          {get(deed, 'value', get(deed, ['task', 'value']))}
        </small>
      </h4>
    </CardTitle>
    <CardTitle>
      <h6 className="deed-card__subtitle">
        {get(deed, ['member', 'displayName'])}
      </h6>
    </CardTitle>
    <CardText>{(new Date(get(deed, 'ts', 0))).toString()}</CardText>
    {isAdmin &&
      <CardActions>
        <Button onTouchTap={() => approveDeed(true)}>Hyväksy</Button>
        <Button accent onTouchTap={() => approveDeed(false)}>Poista</Button>
      </CardActions>
    }
  </Card>;

DeedCard.propTypes = {
  deed: PropTypes.object.isRequired,
  isAdmin: PropTypes.bool,
  approveDeed: PropTypes.func.isRequired
};

export default DeedCard;
