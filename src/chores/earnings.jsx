import React, {PropTypes} from 'react';
import {Card, CardTitle, CardText} from 'react-mdl';
import {reduce, filter, get} from 'lodash';
import {compose, setPropTypes, mapProps} from 'recompose';

// FIXME: Mysterious react update errors with this component

const EarningsMapper = ({deeds, tasks, user}) => ({
  approved: reduce(
    filter(deeds, deed => deed.memberId === user.uid && !!deed.approved && !!get(tasks, deed.taskId)),
    (acc, deed) => acc + get(deed, 'value', get(tasks, [deed.taskId, 'value'], 0)),
    0),
  pending: reduce(
    filter(deeds, deed => deed.memberId === user.uid && !deed.approved && !!get(tasks, deed.taskId)),
    (acc, deed) => acc + get(deed, 'value', get(tasks, [deed.taskId, 'value'], 0)),
    0),
  user
});

const EarningsView = ({user, approved, pending}) =>
  <Card className="earnings" shadow={1}>
    <CardTitle>
      <h4 className="earnings__title">{user.displayName}</h4>
    </CardTitle>
    <CardText className="earnings__status">
      <div className="earnings__status__approved">
        Hyväksytty: {approved} €
      </div>
      <div className="earnings__status__pending">
        Odottaa: {pending}
      </div>
    </CardText>
  </Card>;

EarningsView.propTypes = {
  user: PropTypes.object.isRequired,
  approved: PropTypes.number.isRequired,
  pending: PropTypes.number.isRequired
};

const Earnings = compose(
  setPropTypes({
    tasks: PropTypes.object.isRequired,
    deeds: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired
  }),
  mapProps(EarningsMapper)
)(EarningsView);

export default Earnings;
