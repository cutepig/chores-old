import React, {PropTypes} from 'react';
import {ListItem, ListItemContent, ListItemAction} from 'react-mdl';
import LogoutButton from 'chores/logout-button';

export const UserInfo = ({user}) =>
  <ListItem className="user-info">
    <ListItemContent
        avatar={<img className="user-info__avatar" src={user.photoURL} />}>
        {user.displayName}
    </ListItemContent>
    <ListItemAction>
      <LogoutButton />
    </ListItemAction>
  </ListItem>;

UserInfo.propTypes = {
  user: PropTypes.object
};

export default UserInfo;
