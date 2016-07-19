import React, {PropTypes} from 'react';

export const AdminPanel = () =>
  <div className="admin-panel">
    <h3>Admin</h3>
  </div>;

AdminPanel.propTypes = {
  groupId: PropTypes.string
};

export default AdminPanel;
