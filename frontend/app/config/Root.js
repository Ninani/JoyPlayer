import React, { Component } from 'react';
import { Router, Route, useRouterHistory, browserHistory } from 'react-router';
import { createHashHistory } from 'history';
import shortid from 'shortid';

import App from '../components/App';


const history = useRouterHistory(createHashHistory)({ queryKey: false });

export default class Root extends Component {
  render() {
    return (
      <Router history={browserHistory}>
        <Route path="/" component={App} />
        <Route path="/*" component={App} />
      </Router>
    );
  }
}

