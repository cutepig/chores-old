import React, {PropTypes} from 'react';
import {compose, withReducer, withHandlers, withState, mapProps} from 'recompose';
import {assign} from 'lodash';
import {authProvider, connect} from 'refirebase';
import serialize from 'form-serialize';

// FIXME: Change to use of recompose.branch
// @see https://github.com/acdlite/recompose/blob/master/docs/API.md#branch
// @see https://github.com/acdlite/recompose/blob/master/docs/API.md#rendercomponent
// @see https://github.com/acdlite/recompose/blob/master/docs/API.md#rendernothing
// @see https://github.com/acdlite/recompose/blob/master/docs/API.md#componentfromprop
// ^^ can be used to render just children:
// @example: const RenderChildren = setPropTypes({children: PropTypes.node})(componentFromProp('children'))
export const conditionalRender = predicate => wrappedComponent =>
  class ConditionalRender extends React.Component {
    static get displayName () {
      return `ConditionalRender(${wrappedComponent.displayName || wrappedComponent.name})`;
    }

    shouldComponentUpdate () {
      console.log('shouldComponentUpdate', ConditionalRender.displayName);  // eslint-disable-line
      return true;
    }

    render () {
      const {props} = this;

      console.log(ConditionalRender.displayName, predicate(props), props);    // eslint-disable-line
      return predicate(props) ? React.createElement(wrappedComponent, props) : null;
    }
  };

export const AuthView = compose(
  authProvider,
  conditionalRender(({user}) => !!user)
)(function AuthView ({children}) {
  return React.Children.only(children);
});

export const NonAuthView = compose(
  authProvider,
  conditionalRender(({user}) => !user)
)(function NonAuthView ({children}) {
  return React.Children.only(children);
});

export const AdminView = compose(
  authProvider,
  connect(({groupId, user}) => ({
    member: groupId && user && `/groups/${groupId}/members/${user.uid}`
  })),
  conditionalRender(({member}) => !!member && !!member.isAdmin)
)(function AdminView ({children}) {
  return React.Children.only(children);
});

AdminView.propTypes = assign({}, AdminView.propTypes, {
  groupId: PropTypes.string
});

const findForm = node =>
  node
    ? (node.form || findForm(node.parentNode))
    : node;

export const formProvider = ({onChange, onSubmit}, initialFormData) => compose(
  withReducer('formData', 'onFormChange', (formData, ev) => {
    const form = findForm(ev.target);
    return {
      ...serialize(form, {hash: true, disabled: true, empty: true}),
      __form: form
    };
  }, {...initialFormData, __form: null}),
  withHandlers({
    onSubmit: props => ev => {
      ev.preventDefault();
      // TODO: Integrated validation or whatnot
      return onSubmit(props)(
        serialize(props.formData.__form, {hash: true, disabled: true, empty: true}),
        props.formData.__form
      );
    }
  }),
  // Fight against event pooling which causes problems accessing target or currentTarget
  // @see https://facebook.github.io/react/docs/events.html#event-pooling
  mapProps(props => assign({}, props, {
    onFormChange: ev => {
      ev.persist && ev.persist();
      // TODO: We can map with onChange here cause we got the props
      return props.onFormChange(ev);
    },
    onSubmit: ev => {
      ev.persist && ev.persist();
      return props.onSubmit(ev);
    }
  }))
);

export const modalProvider = compose(
  withState('isOpen', 'setOpen', false),
  withHandlers({
    onOpen: ({setOpen}) => ev => setOpen(true),
    onClose: ({setOpen}) => ev => setOpen(false)
  }));
