import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {GMap} from 'primereact/components/gmap/GMap';

class Map extends Component
{
    onOverlayClick = (event) => {

    };

    onMapReady = (event) => {

    };

    render()
    {
        
        const {
            latitude,
            longitude,
            zoom,
            data,
            ...props
        } = this.props;

        let options = {
            center: { lat: latitude, lng: longitude },
            zoom: zoom
        };

        let overlays = [];

        return (
            <GMap 
                overlays={overlays} 
                options={options} 
                style={{width: '100%', height: '100%'}}
                onOverlayClick={this.onOverlayClick}
                onMapReady={this.onMapReady} />
        );

    }

}

Map.defaultProps = {
    latitude: -23.5798663,
    longitude: -46.6512633,
    zoom: 15
};

export default Map;