import React, { Component } from 'react';

import { Switch, Route } from 'react-router-dom';

import { fetch } from 'ui-stack/request';
import { getUrl } from '../util/url';

import { Sidebar } from 'primereact/components/sidebar/Sidebar';

import Map from '../components/Map';
import Filter from '../components/Filter';
import WatsonChat from '../components/WatsonChat';

import styles from "./Home.module.scss";

import watson from '../images/watson.png';

export default class Home extends Component {

    state = {
        occurrenceIndex: null,
        occurrences: [],
        loading: false,
        error: false,
        showFilter: false,
        showWatson: true,
        position: null,
        recenter: false,
        positionError: false,
        geolocationError: false
    }

    onRecenterClick = (event) => {

        this.setState({ recenter: true });

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

    onToggleFilter = (event) => {

        const {
            occurrenceIndex,
            showFilter
        } = this.state;

        let newOccurrences = this.setShowInfo(occurrenceIndex, false);

        this.setState({ 
            showFilter: !showFilter,
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

    onFilter = (parameters) => {

        let url = getUrl("/occurrence/getOccurrences");

        let success = (response) => {

            debugger;

            let data = response.body;

            if (data.Success)
            {
                this.setState({
                    occurrenceIndex: null,
                    occurrences: data.Data,
                    loading: false,
                    error: false,
                    showFilter: false
                });
            }
            else
            {
                this.setState({
                    occurrenceIndex: null,
                    occurrences: [],
                    loading: false,
                    error: true,
                    showFilter: false
                });
            }

        };

        let error = (error) => {

            this.setState({
                occurrenceIndex: null,
                occurrences: [],
                loading: false,
                error: true,
                showFilter: false
            });

        };

        let request = fetch({ method: "post", url: url, query: null, data: parameters});

        request.then(success)
               .catch(error);

        this.setState({
            occurrenceIndex: null,
            occurrences: [],
            loading: true,
            error: false
        });

    }

    onToggleWatson = (event) => {

        const {
            showWatson
        } = this.state;

        this.setState({showWatson: !showWatson});

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
                            onClick={this.onToggleFilter} />

                    <Sidebar visible={this.state.showFilter}
                             position="left"
                             onHide={(event) => { this.setState({ showFilter: false }) }}>
                        <div style={{height: "25px"}}></div>
                        <Filter onClick={this.onFilter} />
                    </Sidebar>

                    <button className={styles.chatButton} 
                            onClick={this.onToggleWatson}>
                        <img src={watson} title="watson chat" />
                    </button>

                    <Sidebar visible={this.state.showWatson}
                             position="right"
                             onHide={(event) => { this.setState({ showWatson: false }) }}>
                        <div style={{height: "25px"}}></div>
                        <WatsonChat />
                    </Sidebar>

                    <button className={styles.recenterButton + " fa fa-arrows"} 
                            onClick={this.onRecenterClick}/>

                    <button className={styles.geolocationButton + " fa fa-bullseye"} 
                            onClick={this.onGeolocationClick}/>

                    <Map occurrences={this.state.occurrences}
                         position={this.state.position}
                         recenter={this.state.recenter}
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