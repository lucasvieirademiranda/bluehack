import React, { Component } from 'react';

import { Switch, Route } from 'react-router-dom';

import Teste from './Teste';

import Map from '../components/Map';

import styles from "./Home.module.scss";

export default class Home extends Component {

    state = {
        position: null,
        positionError: false,
        geolocationError: false
    }

    onRecenterClick = (event) => {

        this.setState({ position: null });

    };

    onGeolocationClick = (event) => {

        let geolocation = navigator.geolocation;

        if(geolocation)
        {
            let success = (position) => {

                let currentPosition = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                }

                this.setState({ position: currentPosition });

            };

            let error = (error) => {

                this.setState({ positionError: true });

            };

            geolocation.getCurrentPosition(success, error);
        }
        else
        {
            this.setState({ geolocationError: true });
        }

    };

    render() {

        return (
            <div className={styles.layout}>
                
                <div className={styles.main}>
                
                    <button className={styles.filterButton + " fa fa-list"} />

                    <button className={styles.recenterButton + " fa fa-list"} 
                            onClick={this.onRecenterClick}/>

                    <button className={styles.geolocationButton + " fa fa-bullseye"} 
                            onClick={this.onGeolocationClick}/>

                    <Map position={this.state.position}
                         defaultZoom={17} 
                         defaultCenter={{ lat: -23.5798663, lng: -46.6512633 }}
                         style={{width: "100%", height: "100%"}}/>

                </div>

            </div>
        );

    }

}