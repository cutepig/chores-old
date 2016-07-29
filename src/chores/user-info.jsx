import React, {PropTypes} from 'react';

export const UserInfo = ({user}) =>
  <div className="user-info">
    {user
      ? `${user.uid} ${user.displayName}`
      : 'Not logged in'
    }
  </div>;

UserInfo.propTypes = {
  user: PropTypes.object
};

export default UserInfo;
