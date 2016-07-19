import React, {PropTypes} from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import TextField from 'material-ui/TextField';
import Slider from 'material-ui/Slider';
import {compose, withState, withHandlers} from 'recompose';
import serialize from 'form-serialize';
import {v4} from 'uuid';
import {connect} from 'refirebase';
import {formProvider, modalProvider} from 'chores/view-utils';

export const AddTaskDialogView = ({isOpen, onOpen, onClose, onSubmit, onFormChange}) =>
  <div className="add-task-dialog">
    <FloatingActionButton onTouchTap={onOpen}>
      <ContentAdd />
    </FloatingActionButton>

    <Dialog
        className="add-task-dialog__dialog"
        title="Add task"
        actions={[
          <FlatButton label="Cancel" primary onTouchTap={onClose} />,
          <FlatButton label="Submit" primary onTouchTap={onSubmit} />
        ]}
        modal
        open={isOpen}>

      <form className="add-task-dialog__dialog__form" onChange={onFormChange}>
        <TextField floatingLabelText="Task name" name="name" required /><br/>
        <TextField floatingLabelText="Task description" name="description" required /><br/>
        {/* FIXME: Get the state of the component to show the actual value */}
        <Slider description="Task value" name="value" value={1} min={0.25} max={5} step={0.25} required />
      </form>

    </Dialog>
  </div>;

AddTaskDialogView.propTypes = {
  groupId: PropTypes.string,
  isOpen: PropTypes.bool,
  onOpen: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onFormChange: PropTypes.func.isRequired
};

const AddTaskDialog = compose(
  connect(null, (firebase, {groupId}) => ({
    createTask: task =>
      groupId ? firebase.database().ref(`/groups/${groupId}/tasks/${v4()}`).set(task) : Promise.reject()
  })),
  modalProvider,
  formProvider({
    // onChange: formData => formData
    onSubmit: ({createTask, onClose}) => (task, form) =>
      createTask({...task, value: parseFloat(task.value)})
        .then(() => {
          form.reset();
          onClose();
        })
  })
)(AddTaskDialogView);

export default AddTaskDialog;
