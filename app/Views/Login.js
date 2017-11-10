import React, { Component } from 'react';

import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';

import MapView from 'react-native-maps';

function randomColor() {
  return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
}

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      markers: [],
    };
  }

  onMapPress(e) {
    this.setState({
      markers: [
        ...this.state.markers,
        {
          coordinate: e.nativeEvent.coordinate,
          key: id++,
          color: randomColor(),
        },
      ],
    });
  }
  render() {
    return (
      <View style ={styles.container}>
      <MapView
        style={styles.map}
        mapType="hybrid"
        showsUserLocation={true}
        followsUserLocation={true}>
        {this.state.markers.map(marker => (
            <MapView.Marker
              key={marker.key}
              coordinate={marker.coordinate}
              pinColor={marker.color}
            />
          ))}        
      </MapView>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
            onPress={() => this.setState({ markers: [] })}
            style={styles.bubble}>
          <Text>Tap to create a marker of random color</Text>
        </TouchableOpacity>
      </View> 
    </View>
    );
  }
}

DefaultMarkers.propTypes = {
  provider: MapView.ProviderPropType,
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  bubble: {
    backgroundColor: 'rgba(255,255,255,0.7)',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 20,
  },
  latlng: {
    width: 200,
    alignItems: 'stretch',
  },
  button: {
    width: 80,
    paddingHorizontal: 12,
    alignItems: 'center',
    marginHorizontal: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginVertical: 20,
    backgroundColor: 'transparent',
  },
});

module.exports = DefaultMarkers;