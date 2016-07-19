import React, {PropTypes} from 'react';
import {mapValues, filter, map, get} from 'lodash';
import {compose, mapProps} from 'recompose';
import {connect, authProvider} from 'refirebase';
import DeedCard from 'chores/deed-card';

const DeedListConnect = connect(({groupId}, firebase) => ({
  deeds: groupId && `/groups/${groupId}/deeds`,
  tasks: groupId && `/groups/${groupId}/tasks`
}));

const DeedListMapper = ({deeds, tasks, user, ...rest}) => ({
  deeds: mapValues(
    filter(deeds, deed => deed.memberId === user.uid),
    deed => ({
      task: get(tasks, deed.taskId),
      member: user
    })),
  ...rest
});

export const DeedListView = ({deeds}) =>
  <ul className="deed-list">
  {map(deeds, (deed, id) =>
    <li className="deed-list__item" key={id}>
      <DeedCard deed={deed} />
    </li>
  )}
  </ul>;

DeedListView.propTypes = {
  groupId: PropTypes.string,
  deeds: PropTypes.object
};

const DeedList = compose(
  DeedListConnect,
  authProvider,
  mapProps(DeedListMapper)
)(DeedListView);

export default DeedList;
