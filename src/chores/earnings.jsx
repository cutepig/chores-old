import React, {PropTypes} from 'react';
import {reduce, filter, get} from 'lodash';
import {compose, mapProps} from 'recompose';
import {connect, authProvider} from 'refirebase';

// FIXME: Mysterious react update errors with this component

const EarningsConnect = connect(({groupId}) => ({
  deeds: groupId && `/groups/${groupId}/deeds`,
  tasks: groupId && `/groups/${groupId}/tasks`
}));

const EarningsMapper = ({deeds, tasks, user, ...rest}) => ({
  approved: reduce(
    filter(deeds, deed => deed.memberId === user.uid && !!deed.approved && !!get(tasks, deed.taskId)),
    (acc, deed) => acc + get(deed, 'value', get(tasks, deed.taskId, 'value')),
    0),
  pending: reduce(
    filter(deeds, deed => deed.memberId === user.uid && !deed.approved && !!get(tasks, deed.taskId)),
    (acc, deed) => acc + get(deed, 'value', get(tasks, deed.taskId, 'value')),
    0),
  user,
  ...rest
});

const EarningsView = ({user, approved, pending}) =>
  <article className="earnings">
    <h1>{user.displayName}</h1>
    <ul>
      <li key="approved">Approved: {approved}</li>
      <li key="pending">Pending: {pending}</li>
    </ul>
  </article>;

EarningsView.propTypes = {
  groupId: PropTypes.string,
  user: PropTypes.object,
  approved: PropTypes.number.isRequired,
  pending: PropTypes.number.isRequired
};

const Earnings = compose(
  EarningsConnect,
  authProvider,
  mapProps(EarningsMapper)
)(EarningsView);

export default Earnings;
