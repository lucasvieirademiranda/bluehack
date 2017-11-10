import React, { Component, StyleSheet, View, TouchableOpacity, Image } from 'react-native';

import { COLOR, IconToggle, Icon } from 'react-native-material-design';

import MapView from 'react-native-maps';

let id = 0;

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
        onPress={(e) => this.onMapPress(e)}
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
        <TouchableOpacity onPress={() => this.setState({ markers: [] })} style={styles.bubble}>
          <Icon
							name="add"
							style={styles.icon}
					/>
        </TouchableOpacity>
      </View> 
    </View>
    );
  }
}

App.propTypes = {
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
  buttonContainer: {
    flexDirection: 'row',
    marginVertical: 20,
    backgroundColor: 'transparent',
  },
	icon: {
		margin: 16
	}  
});