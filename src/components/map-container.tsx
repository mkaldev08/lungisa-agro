import React from 'react';
import { Platform, Text } from 'react-native';
import { AppleMaps, GoogleMaps } from 'expo-maps';

export const MapContainer: React.FC = () => {
  if (Platform.OS === 'ios') {
    return <AppleMaps.View style={{ flex: 1 }} />;
  } else if (Platform.OS === 'android') {
    return <GoogleMaps.View style={{ flex: 1 }} />;
  } else {
    return <Text>Maps are only available on Android and iOS</Text>;
  }

}
