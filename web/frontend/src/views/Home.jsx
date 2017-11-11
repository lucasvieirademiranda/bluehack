import React, { Component } from 'react';

import { Switch, Route } from 'react-router-dom';

import { Sidebar } from 'primereact/components/sidebar/Sidebar';

import Map from '../components/Map';
import Filter from '../components/Filter';

import styles from "./Home.module.scss";

export default class Home extends Component {

    state = {
        occurrenceIndex: null,
        occurrences: [{ latitude: -23.5798663, longitude: -46.6512633, showInfo: false }],
        showSidebar: false,
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

    onToggleSidebar = (event) => {

        const {
            occurrenceIndex,
            showSidebar
        } = this.state;

        let newOccurrences = this.setShowInfo(occurrenceIndex, false);

        this.setState({ 
            showSidebar: !showSidebar,
        });

    };

    onMarkerClick = (occurrenceIndex, showInfo) => {

        showInfo = !showInfo;

        let newOccurrences = this.setShowInfo(occurrenceIndex, showInfo);

        this.setState({
            occurrences: newOccurrences,
            occurrenceIndex: showInfo ? occurrenceIndex : null
        });

    };
    
    onInfoWindowClose = (occurrenceIndex) => {

        let showInfo = false;

        let newOccurrences = this.setShowInfo(occurrenceIndex, showInfo);

        this.setState({
            occurrences: newOccurrences,
            occurrenceIndex: null
        });

    };

    setShowInfo = (occurrenceIndex, showInfo) => {

        const { occurrences } = this.state;
        
        let newOccurrences = occurrences.concat([]);

        for(let i = 0; i < newOccurrences.length; i++)
        {
            if(i === occurrenceIndex)
            {
                newOccurrences[i].showInfo = showInfo;
                break;
            }
        }

        return newOccurrences;

    }

    render() {

        return (
            <div className={styles.layout}>
                
                <div className={styles.main}>
                
                    <button className={styles.filterButton + " fa fa-list"} 
                            onClick={this.onToggleSidebar} />

                    <Sidebar visible={this.state.showSidebar}
                             position="left"
                             onHide={(event) => { this.setState({ showSidebar: false }) }}>
                        <div style={{height: "25px"}}></div>
                        <Filter />
                    </Sidebar>

                    <button className={styles.recenterButton + " fa fa-arrows"} 
                            onClick={this.onRecenterClick}/>

                    <button className={styles.geolocationButton + " fa fa-bullseye"} 
                            onClick={this.onGeolocationClick}/>

                    <Map occurrences={this.state.occurrences}
                         position={this.state.position}
                         defaultZoom={17} 
                         defaultCenter={{ lat: -23.5798663, lng: -46.6512633 }}
                         onMarkerClick={this.onMarkerClick}
                         onInfoWindowClose={this.onInfoWindowClose}
                         style={{width: "100%", height: "100%"}}/>

                </div>

            </div>
        );

    }

}