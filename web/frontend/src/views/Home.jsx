import React, { Component } from 'react';

import { Switch, Route } from 'react-router-dom';

import Teste from './Teste';

import Map from '../components/Map';

import styles from "./Home.module.scss";

export default class Home extends Component {

    render() {

        return (
            <div className={styles.layout}>
                <div className={styles.main}>
                    
                    <Map />

                    <Switch>
                        <Route path="/Teste" component={Teste} />
                    </Switch>

                </div>
            </div>
        );

    }

}