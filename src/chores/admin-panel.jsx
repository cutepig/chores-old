import React, {PropTypes} from 'react';
import AddTaskDialog from 'chores/add-task-dialog';

export const AdminPanel = ({groupId}) =>
  <div className="admin-panel">
    <AddTaskDialog groupId={groupId} />
  </div>;

AdminPanel.propTypes = {
  groupId: PropTypes.string
};

export default AdminPanel;
