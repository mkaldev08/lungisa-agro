import React, { useEffect } from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MapContainer, MapHeader, RegionInfoCard } from '@/components';
import { NavigationButton } from '@/components/navigation-button';
import { useMapRegion } from '@/hooks/useMapRegion';
import { SafeAreaView } from 'react-native-safe-area-context';

export const MapOfRegion: React.FC = () => {
  const navigation = useNavigation();
  const {
    currentRegion,
    selectedInfo,
    markers,
    handleRegionChange,
    addMarker,
  } = useMapRegion();

  // Add sample markers on mount
  useEffect(() => {
    addMarker({
      id: '1',
      coordinate: {
        latitude: -8.8383,
        longitude: 13.2344,
      },
      title: 'Luanda',
      description: 'Capital de Angola',
    });
  }, []);

  return (
    <SafeAreaView className='flex-1 bg-white'>
      <MapHeader 
        title='Mapa da Região' 
        subtitle='Selecione a área agrícola'
      />
      
      <MapContainer
        region={currentRegion}
        onRegionChange={handleRegionChange}
        markers={markers}
      />

      <RegionInfoCard
        province={selectedInfo.province}
        municipality={selectedInfo.municipality}
        area={selectedInfo.area}
      />

      <View className='absolute bottom-20 left-6 right-6'>
        <NavigationButton
          title='Próximo'
          onPress={() => navigation.navigate('SoilQuestions')}
        />
      </View>
    </SafeAreaView>
  );
};

