import React, { Component } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import 'primereact/resources/themes/omega/theme.css';
import 'primereact/components/common/Common.css';
import 'font-awesome/css/font-awesome.css';

import Login from './Login';
import Home from './Home';
import NotFound from './NotFound';

export default class App extends Component {

    render() {

        return (
            <BrowserRouter>
                <Switch>
                    <Route exact path="/login" component={Login} />
                    <Route path="/" component={Home} />
                </Switch>
            </BrowserRouter>
        );

    }

}