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
    return React.Children.only(this.props.children);
  }
}

export const connect = (mapRefsToProps, mapFirebaseToProps) => wrappedComponent =>
  class Firebase extends React.Component {
    static get displayName () {
      return `Firebase(${wrappedComponent.displayName || wrappedComponent.name})`;
    }

    static get contextTypes () {
      return {firebase: firebaseShape};
    }

    constructor (props, {firebase}) {
      super(props);
      this.state = {};
    }

    shouldComponentUpdate () {
      // TODO:
      console.log('shouldComponentUpdate', Firebase.displayName);
      return true;
    }

    componentWillMount () {
      const {firebase} = this.context;

      console.log('componentWillMount', Firebase.displayName);

      // Handle subscriptions to refs
      // FIXME: Do this again when props change
      const refs = _.isFunction(mapRefsToProps) ? mapRefsToProps(this.props, firebase) : {};
      const unsubscriptions = _.mapValues(refs, (path, key) => {
        const onValue = snapshot => this.setState({...this.state, [key]: snapshot.val()});

        // FIXME: Wrap this in a function that checks if return value is string and then
        // handles it as below
        if (_.isFunction(path))
          return path(onValue);

        if (!path)
          return path;

        // FIXME: cancelCallbackOrContext
        // @see https://firebase.google.com/docs/reference/js/firebase.database.Reference#on
        return firebase.database().ref(path).on('value', onValue);
      });

      this.unsubscriptions = unsubscriptions;
    }

    componentWillUnmount () {
      const {firebase} = this.context;

      console.log('componentWillUnmount', Firebase.displayName);

      // Handle unsubscriptions
      _.forEach(this.unsubscriptions, (path, fn) =>
        _.isFunction(fn) && firebase.database().ref(path).off('value', fn));
    }

    render () {
      const {props, state} = this;
      const {firebase} = this.context;

      const firebaseProps = _.mapValues(
        _.isFunction(mapFirebaseToProps) ? mapFirebaseToProps(firebase) : {},
        // FIXME: Some proper error handling
        // eslint-disable-next-line no-console
        (fn, key) => (...args) => fn(...args).catch(error => console.error(Firebase.displayName, key, error))
      );

      return React.createElement(wrappedComponent, {...props, ...state, ...firebaseProps, firebase});
    }
  };

export const authProvider = wrappedComponent =>
  class AuthProvider extends React.Component {
    static get displayName () {
      return `AuthProvider(${wrappedComponent.displayName || wrappedComponent.name})`;
    }

    static get contextTypes () {
      return {firebase: firebaseShape};
    }

    constructor (props) {
      super(props);
      this.state = {};
    }

    shouldComponentUpdate () {
      console.log('shouldComponentUpdate', AuthProvider.displayName);
      return true;
    }

    componentWillMount () {
      const {firebase} = this.context;

      this.unsubscribe = firebase.auth().onAuthStateChanged(user =>
        this.setState({...this.state, user}));
    }

    componentWillUnmount () {
      this.unsubscribe && this.unsubscribe();
    }

    render () {
      const {props, state} = this;

      return React.createElement(wrappedComponent, {...props, ...state});
    }
  };
