import React, {PropTypes} from 'react';
import {compose} from 'recompose';
import {assign} from 'lodash';
import {authProvider, connect} from 'refirebase';

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
