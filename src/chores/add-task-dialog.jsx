import React, {PropTypes} from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import TextField from 'material-ui/TextField';
import Slider from 'material-ui/Slider';
import {compose} from 'recompose';
import {v4} from 'uuid';
import {connect} from 'refirebase';
import {formProvider, modalProvider} from 'chores/view-utils';

export const AddTaskDialogConnect = connect(
  null,
  (firebase, {groupId}) => ({
    createTask: task =>
      groupId ? firebase.database().ref(`/groups/${groupId}/tasks/${v4()}`).set(task) : Promise.reject()
  }));

export const AddTaskDialogForm = formProvider(
  {
    // onChange: formData => formData
    onSubmit: ({createTask, onClose}) => (task, form) =>
      createTask({...task, value: parseFloat(task.value)})
        .then(() => {
          form.reset();
          onClose();
        })
  },
  {  // default values
    value: 1
  });

export const AddTaskDialogView = ({isOpen, formData, onOpen, onClose, onSubmit, onFormChange}) =>
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
        <TextField floatingLabelText="Task name" name="name" value={formData.name} required /><br/>
        <TextField floatingLabelText="Task description" name="description" value={formData.description} required /><br/>
        {/* FIXME: Get this call onChange more often */}
        <label>
          <Slider description="Task value" name="value" value={formData.value} min={0.25} max={5} step={0.25} required onChange={onFormChange} />
          <span>{`${formData.value} €`}</span>
        </label>
      </form>

    </Dialog>
  </div>;

AddTaskDialogView.propTypes = {
  groupId: PropTypes.string,
  isOpen: PropTypes.bool,
  formData: PropTypes.object,
  onOpen: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onFormChange: PropTypes.func.isRequired
};

const AddTaskDialog = compose(
  AddTaskDialogConnect,
  modalProvider,
  AddTaskDialogForm
)(AddTaskDialogView);

export default AddTaskDialog;
