import React, {PropTypes} from 'react';
import * as _ from 'lodash';
import isPromise from 'is-promise';

export const firebaseShape = PropTypes.shape({
  database: PropTypes.func.isRequired,
  auth: PropTypes.func.isRequired
});

// FIXME: Just use recompose.withContext
// @see https://github.com/acdlite/recompose/blob/master/docs/API.md#withcontext
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
      console.log('shouldComponentUpdate', Firebase.displayName);     // eslint-disable-line no-console
      return true;
    }

    _subscribe (props) {
      const {firebase} = this.context;

      const refs = _.isFunction(mapRefsToProps) ? mapRefsToProps(props, firebase) : {};

      const unsubscriptions = _.mapValues(refs, (path, key) => {
        const onValue = snapshot => {
          const val = snapshot.val();
          console.log('onValue', Firebase.displayName, key, val);    // eslint-disable-line no-console
          this.setState({...this.state, [key]: val});
        };

        // FIXME: Wrap this in a function that checks if return value is string and then
        // handles it as below
        if (_.isFunction(path))
          return path(onValue);

        if (!path)
          return path;

        console.log(Firebase.displayName, 'subscribing to', path);   // eslint-disable-line no-console

        // FIXME: cancelCallbackOrContext
        // @see https://firebase.google.com/docs/reference/js/firebase.database.Reference#on
        return firebase.database().ref(path).on('value', onValue);
      });

      return unsubscriptions;
    }

    _unsubscribe () {
      const {firebase} = this.context;

      _.forEach(this.unsubscriptions, (path, fn) =>
        _.isFunction(fn) && firebase.database().ref(path).off('value', fn));
    }

    componentWillReceiveProps (nextProps) {
      console.log('componentWillReceiveProps', Firebase.displayName, {...nextProps});     // eslint-disable-line no-console

      this.unsubscribe = this._unsubscribe();
      this.unsubscriptions = this._subscribe(nextProps);
    }

    componentWillMount () {
      console.log('componentWillMount', Firebase.displayName);        // eslint-disable-line no-console

      this.unsubscriptions = this._subscribe(this.props);
    }

    componentWillUnmount () {
      const {firebase} = this.context;

      console.log('componentWillUnmount', Firebase.displayName);      // eslint-disable-line no-console

      // Handle unsubscriptions
      _.forEach(this.unsubscriptions, (path, fn) =>
        _.isFunction(fn) && firebase.database().ref(path).off('value', fn));
    }

    render () {
      const {props, state} = this;
      const {firebase} = this.context;

      // FIXME: Move this along with subscribe
      const firebaseProps = _.mapValues(
        _.isFunction(mapFirebaseToProps) ? mapFirebaseToProps(firebase, props) : {},
        (fn, key) => (...args) => {
          // Ensure this is a promise and put a catch handler there
          const ret = fn(...args);
          if (isPromise(ret)) {
            // FIXME: Some proper error handling, maybe provide an error handler in props/params?
            // eslint-disable-next-line no-console
            return ret.catch(error => {
              console.error(Firebase.displayName, key, error);
              return Promise.reject(error);
            });
          }

          return Promise.resolve(ret);
        }
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
      console.log('shouldComponentUpdate', AuthProvider.displayName);     // eslint-disable-line no-console
      return true;
    }

    componentWillMount () {
      const {firebase} = this.context;

      console.log('componentWillMount', AuthProvider.displayName);

      // FIXME: It does seem that firebase executes these async which causes
      // async update issues where one component above thinks user is there but
      // the lower component doesnt and there's a mismatch
      // Maybe use static unsubscribe and reference counting on componentWillMount/Unmount?
      // Argh that wouldn't solve anything since we still have many instances of each different class
      setTimeout(() => {
        this.unsubscribe = firebase.auth().onAuthStateChanged(user => {
          console.log('onAuthStateChanged', AuthProvider.displayName, user);    // eslint-disable-line no-console
          this.setState({...this.state, user});
        });
      }, 0);
    }

    componentWillUnmount () {
      console.log('componentWillUnmount', AuthProvider.displayName);
      this.unsubscribe && this.unsubscribe();
    }

    render () {
      const {props, state} = this;

      return React.createElement(wrappedComponent, {...props, ...state});
    }
  };
