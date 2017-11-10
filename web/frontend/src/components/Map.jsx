import React, { Component } from 'react';

import { compose, withProps } from "recompose"

import { 
    withScriptjs, 
    withGoogleMap, 
    GoogleMap,
    Marker,
    InfoWindow
} from 'react-google-maps';

import PropTypes from 'prop-types';

import bullseye from '../images/bullseye.png';

const Map = compose(
    withProps({
      googleMapURL: "https://maps.googleapis.com/maps/api/js?key=AIzaSyAEiQ0AliVRHDn5-sgYx4239w6_rv-8uHA&v=3.exp&libraries=geometry,drawing,places",
      loadingElement: <div style={{ height: '100%' }} />,
      containerElement: <div style={{ height: '100%' }} />,
      mapElement: <div style={{ height: '100%' }} />,
    }),
    withScriptjs,
    withGoogleMap
  )((props) => {
      
    const {
        occurrences,
        position,
        defaultZoom,
        defaultCenter,
        center,
        onMarkerClick,
        onInfoWindowClose,
        ...otherProps
    } = props;

    let currentCenter = defaultCenter;

    if (position)
        currentCenter = position;

    return (

        <GoogleMap
            options={{
                center: currentCenter,
                zoom: defaultZoom,
                disableDefaultUI: true,
                zoomControl: true
            }} >

        {occurrences && 
         occurrences.length > 0 && 
         occurrences.map((occurrence, index) => {
           
            debugger;

           return(
                <Marker key={index}
                        position={{ lat: occurrence.latitude, lng: occurrence.longitude}}
                        onClick={() => onMarkerClick(index, occurrence.showInfo)}>
                    {occurrence.showInfo && <InfoWindow key={index} onCloseClick={() => onInfoWindowClose(index)}>
                        <div>Teste</div>
                    </InfoWindow>}
                </Marker>
           );

         })}

        {position && <Marker defaultOptions={{
            position: { lat: position.lat, lng: position.lng },
            icon: bullseye,
            title: "Você"
        }}/>}

        </GoogleMap>

    );

  });

export default Map;