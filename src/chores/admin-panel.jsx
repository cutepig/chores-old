import React, {PropTypes} from 'react';
import AddTaskDialog from 'chores/add-task-dialog';

export const AdminPanel = ({groupId}) =>
  <div className="admin-panel">
    <h3>Admin</h3>
    <AddTaskDialog groupId={groupId} />
  </div>;

AdminPanel.propTypes = {
  groupId: PropTypes.string
};

export default AdminPanel;
