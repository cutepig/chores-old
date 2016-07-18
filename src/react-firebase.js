import React, {PropTypes} from 'react';
import * as _ from 'lodash';

const firebaseShape = PropTypes.shape({
  database: PropTypes.func.isRequired,
  auth: PropTypes.func.isRequired
});

export class Provider extends React.Component {
  static get propTypes () {
    return {
      firebase: firebaseShape.isRequired,
      children: PropTypes.node
    };
  }

  static get childContextTypes () {
    return {firebase: firebaseShape};
  }

  getChildContext () {
    return {firebase: this.props.firebase};
  }

  render () {
    console.log('Provider children', this.props.children);
    return React.Children.only(this.props.children);
  }
}

export const connect = (mapRefsToProps, mapFirebaseToProps) => wrappedComponent =>
  class Firebase extends React.Component {
    static get displayName () {
      return `Firebase(${wrappedComponent.displayName})`;
    }

    static get contextTypes () {
      return {firebase: firebaseShape};
    }

    constructor (props, {firebase}) {
      super(props);
      this.state = {};
    }

    componentWillMount () {
      console.log(`${this.displayName} componentWillMount`);
      const {firebase} = this.context;

      // TODO: Allow refs to be functions

      // Handle subscriptions to refs
      const unsubscriptions = _.mapValues(mapRefsToProps, (path, key) =>
        // FIXME: cancelCallbackOrContext
        // @see https://firebase.google.com/docs/reference/js/firebase.database.Reference#on
        firebase.database().ref(path).on('value', snapshot =>
          this.setState({...this.state, [key]: snapshot.val()})));

      this.unsubscriptions = unsubscriptions;
    }

    componentWillUnmount () {
      console.log(`${this.displayName} componentWillUnmount`);
      const {firebase} = this.context;

      // Handle unsubscriptions
      _.forEach(this.unsubscriptions, (path, fn) =>
        firebase.database().ref(path).off('value', fn));
    }

    render () {
      const {props, state} = this;
      const {firebase} = this.context;
      const firebaseProps = _.isFunction(mapFirebaseToProps) ? mapFirebaseToProps(firebase) : {};

      return React.createElement(wrappedComponent, {...props, ...state, ...firebaseProps, firebase});
    }
  };
