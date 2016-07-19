import React from 'react';
import {compose} from 'recompose';
import {authProvider} from './react-firebase';

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
)(({children}) => React.Children.only(children));

export const NonAuthView = compose(
  authProvider,
  conditionalRender(({user}) => !user)
)(({children}) => React.Children.only(children));
