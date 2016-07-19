import React, {PropTypes} from 'react';
import {map} from 'lodash';
import {compose, withHandlers} from 'recompose';
import {connect, authProvider} from 'refirebase';

export const GroupSelectView = ({groups, onChange}) =>
  <div className="group-select">
    <label className="group-select__label">
      Select group
      <select className="group-select__select" defaultValue="" onChange={onChange}>
        <option disabled value="">Select group</option>
        {map(groups, (name, id) =>
          <option key={id} value={id}>{name}</option>
        )}
      </select>
    </label>
  </div>;

GroupSelectView.propTypes = {
  groups: PropTypes.object,
  onChange: PropTypes.func.isRequired
};

const GroupSelect = compose(
  authProvider,
  connect(({user}, firebase) => ({
    groups: user && `/users/${user.uid}/groups`
  })),
  withHandlers({
    onChange: ({onSelectGroup}) => ev => onSelectGroup(ev.currentTarget.value)
  })
)(GroupSelectView);

export default GroupSelect;
