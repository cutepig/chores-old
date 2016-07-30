import React, {PropTypes} from 'react';
import {List, ListItem, ListItemContent, ListItemAction, Icon} from 'react-mdl';
import {map} from 'lodash';
import {preventDefault} from 'chores/view-utils';

export const GroupSelect = ({groups, onSelectGroup}) =>
  <div className="group-select">
    <List className="group-select__list">
      {map(groups, (name, id) =>
        <ListItem
            key={id}
            className="group-select__list__item"
            onClick={preventDefault(() => onSelectGroup(id))}>
          <ListItemContent>{name}</ListItemContent>
          <ListItemAction>
            <Icon name="chevron_right" />
          </ListItemAction>
        </ListItem>
      )}
    </List>
  </div>;

GroupSelect.propTypes = {
  groups: PropTypes.object,
  onSelectGroup: PropTypes.func.isRequired
};

export default GroupSelect;
