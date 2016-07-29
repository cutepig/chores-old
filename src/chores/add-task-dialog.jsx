import React, {PropTypes} from 'react';
import {
  FABButton, Icon, Button, Textfield, Slider,
  Dialog, DialogTitle, DialogContent, DialogActions
} from 'react-mdl';
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
    name: '',
    description: '',
    value: 1
  });

export const AddTaskDialogView = ({isOpen, formData, onOpen, onClose, onSubmit, onFormChange}) =>
  <div className="add-task-dialog">
    <div className="add-task-dialog__open">
      <FABButton primary onTouchTap={onOpen}>
        <Icon name="add" />
      </FABButton>
    </div>

    <Dialog className="add-task-dialog__dialog" onCancel={x => x} open={isOpen}>
      <DialogTitle>Lisää tehtävä</DialogTitle>
      <DialogContent>
        <form className="add-task-dialog__dialog__form" onChange={onFormChange}>
          <Textfield label="Nimike" name="name" value={formData.name || ''} required />
          <Textfield label="Kuvaus" name="description" value={formData.description || ''} required />
          <label>
            {`${formData.value} €`}
            <Slider name="value" value={parseFloat(formData.value)} min={0.25} max={5} step={0.25} required onChange={onFormChange} />
          </label>
        </form>
      </DialogContent>

      <DialogActions fullWidth={false}>
          <Button primary onTouchTap={onClose}>Peruuta</Button>,
          <Button primary onTouchTap={onSubmit}>OK</Button>
      </DialogActions>
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
