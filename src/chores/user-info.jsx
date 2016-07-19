import React, {PropTypes} from 'react';
import {authProvider} from 'refirebase';

export const UserInfoView = ({user}) =>
  <div className="user-info">
    {user
      ? `${user.uid} ${user.displayName}`
      : 'Not logged in'
    }
  </div>;

UserInfoView.propTypes = {
  user: PropTypes.object
};

const UserInfo = authProvider(UserInfoView);

export default UserInfo;
