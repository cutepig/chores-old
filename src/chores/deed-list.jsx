import React, {PropTypes} from 'react';
import {mapValues, pickBy, map, get} from 'lodash';
import {compose, mapProps, withHandlers} from 'recompose';
import {connect, adminProvider} from 'chores/view-utils';
import DeedCard from 'chores/deed-card';

const DeedListConnect = connect(
  ({groupId}, firebase) => ({
    deeds: groupId && `/groups/${groupId}/deeds`,
    tasks: groupId && `/groups/${groupId}/tasks`
  }),
  (firebase, {groupId}) => ({
    updateDeed: (deedId, deed) =>
      firebase.database().ref(`/groups/${groupId}/deeds/${deedId}`).set(deed)
  }));

const DeedListMapper = ({deeds, tasks, user, ...rest}) => ({
  deeds: mapValues(
    // FIXME: Remove the deeds that reference removed task, @see task-list.jsx
    // TODO: Configure these filters in props (showApproved)
    pickBy(deeds, deed => deed.memberId === user.uid && !deed.approved && !!get(tasks, deed.taskId)),
    // TODO: Models and whatnots
    deed => ({
      task: get(tasks, deed.taskId),
      member: user
    })),
  ...rest
});

export const DeedListView = ({deeds, isAdmin, approveDeedFactory}) =>
  <ul className="deed-list">
  {map(deeds, (deed, id) =>
    <li className="deed-list__item" key={id}>
      <DeedCard deed={deed} isAdmin={isAdmin} approveDeed={approveDeedFactory(id)} />
    </li>
  )}
  </ul>;

DeedListView.propTypes = {
  groupId: PropTypes.string,
  deeds: PropTypes.object,
  isAdmin: PropTypes.bool,
  approveDeedFactory: PropTypes.func.isRequired
};

const DeedList = compose(
  DeedListConnect,
  adminProvider,
  withHandlers({
    approveDeedFactory: ({updateDeed, deeds}) => deedId => () =>
      updateDeed(deedId, {...deeds[deedId], approved: true})
  }),
  mapProps(DeedListMapper)
)(DeedListView);

export default DeedList;
