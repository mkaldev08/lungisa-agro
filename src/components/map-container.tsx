import React from 'react';
import { Platform, Text, View } from 'react-native';
import { AppleMaps, GoogleMaps } from 'expo-maps';
import { MapContainerProps } from '../types/map';

export const MapContainer: React.FC<MapContainerProps> = ({ region }) => {
  if (Platform.OS === 'ios') {
    return (
      <AppleMaps.View
        style={{ flex: 1 }}
      />
    );
  } else if (Platform.OS === 'android') {
    return (
      <GoogleMaps.View
        style={{ flex: 1 }}
      />
    );
  } else {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Maps are only available on Android and iOS</Text>
      </View>
    );
  }
};
