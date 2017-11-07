import React, { Component } from 'react';
import MapView from 'react-native-maps';

export default class App extends Component {
  render() {
    return (
      <MapView
        style={{height: 800, margin: 40}}
        showsUserLocation={true} />   
    );
  }
};