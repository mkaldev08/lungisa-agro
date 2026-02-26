import type { StaticScreenProps } from '@react-navigation/native';
import { AppleMaps, GoogleMaps } from 'expo-maps';
import { Platform, StyleSheet, Text, View, Alert } from 'react-native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { MapHeader, LocationSearchBar, LocationSearchResults, CurrentLocationButton, type LocationResult } from '@/components';
import { NavigationButton } from '@/components/navigation-button';
import { MAP_REGIONS } from '@/constants/map';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Location from 'expo-location';
import { useVoiceGuide } from '@/hooks/useVoiceGuide';
import { voiceService } from '@/services/voiceService';
import { useAccessibilityStore } from '@/store/accessibilityStore';

type Props = StaticScreenProps<{
  cropId: string;
}>;

type CoordinateType = {
  latitude: number;
  longitude: number;
};

type MapClickEventCoordinates = {
  latitude?: number;
  longitude?: number;
};

export const MapOfRegion: React.FC<Props> = ({ route }) => {
  const navigation = useNavigation();
  const { cropId } = route.params as { cropId: string };
  const voiceEnabled = useAccessibilityStore((state) => state.voiceEnabled);
  const lastSpokenLocationRef = useRef<string | null>(null);

  const googleMapRef = useRef<GoogleMaps.MapView>(null);
  const appleMapRef = useRef<AppleMaps.MapView>(null);

  // Estado para armazenar a localização selecionada
  const [selectedLocation, setSelectedLocation] = useState<CoordinateType | null>(null);

  const [initialRegion, setInitialRegion] = useState<CoordinateType>({
    latitude: MAP_REGIONS.ANGOLA.latitude,
    longitude: MAP_REGIONS.ANGOLA.longitude,
  });

  // Estados para pesquisa de local
  const [searchText, setSearchText] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<LocationResult[]>([]);
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  useVoiceGuide(
    'Escolha a localização. Pesquise ou toque no mapa. Depois toque em Confirmar Local.',
    [],
  );

  const speakIfEnabled = useCallback(
    (text: string) => {
      if (voiceEnabled) {
        voiceService.speak(text);
      }
    },
    [voiceEnabled],
  );

  // Obter localização do usuário ao carregar
  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();

        if (status !== 'granted') {
          Alert.alert(
            'Permissão de localização',
            'Para uma melhor experiência, permita o acesso à sua localização. Você pode pesquisar manualmente ou tocar no mapa.'
          );
          return;
        }

        try {
          const location = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.High,
            timeInterval: 5000,
          });

          const userLocation: CoordinateType = {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          };

          setInitialRegion(userLocation);
          setSelectedLocation(userLocation);

          // Mover câmera para localização do usuário
          setTimeout(() => {
            if (Platform.OS === 'android' && googleMapRef.current) {
              googleMapRef.current.setCameraPosition({
                coordinates: userLocation,
                zoom: 15,
              });
            } else if (Platform.OS === 'ios' && appleMapRef.current) {
              appleMapRef.current.setCameraPosition({
                coordinates: userLocation,
                zoom: 15,
              });
            }
          }, 500);
        } catch (locationError) {
          console.error('Erro ao obter localização atual:', locationError);
          Alert.alert(
            'Localização não disponível',
            'Não foi possível obter sua localização atual. Verifique se o GPS está ligado ou use a pesquisa para encontrar seu local.'
          );
        }
      } catch (error) {
        console.error('Erro ao solicitar permissão:', error);
      }
    })();
  }, []);

  // Manipular clique no mapa para selecionar localização
  const handleMapClick = (event: { coordinates: MapClickEventCoordinates }) => {
    const { coordinates } = event;

    if (coordinates && coordinates.latitude !== undefined && coordinates.longitude !== undefined) {
      setSelectedLocation({
        latitude: coordinates.latitude,
        longitude: coordinates.longitude,
      });
    }
  };

  useEffect(() => {
    if (!selectedLocation) {
      lastSpokenLocationRef.current = null;
      return;
    }

    const key = `${selectedLocation.latitude.toFixed(4)}-${selectedLocation.longitude.toFixed(4)}`;
    if (lastSpokenLocationRef.current === key) {
      return;
    }

    lastSpokenLocationRef.current = key;
    speakIfEnabled('Local marcado. Toque em Confirmar Local.');
  }, [selectedLocation, speakIfEnabled]);

  // Pesquisar local pelo nome
  const handleSearchLocation = async () => {
    if (!searchText.trim()) {
      Alert.alert('Digite um local', 'Por favor, digite o nome de uma cidade, província ou endereço.');
      return;
    }

    setIsSearching(true);
    setSearchResults([]);

    try {
      // Verificar permissão de localização
      const { status } = await Location.getForegroundPermissionsAsync();

      if (status !== 'granted') {
        Alert.alert(
          'Permissão necessária',
          'Para pesquisar locais, precisamos de permissão para acessar sua localização. Você pode habilitar isso nas configurações.',
          [
            { text: 'OK', style: 'cancel' },
            { text: 'Abrir Configurações', onPress: () => Location.requestForegroundPermissionsAsync() }
          ]
        );
        setIsSearching(false);
        return;
      }

      // Adicionar "Angola" à pesquisa para melhorar resultados
      const searchQuery = searchText.includes('Angola') ? searchText : `${searchText}, Angola`;

      const results = await Location.geocodeAsync(searchQuery);

      if (results && results.length > 0) {
        // Converter resultados para nosso formato
        const locationResults: LocationResult[] = results.map((result, index) => {
          // Tentar criar um nome mais descritivo
          const name = index === 0 ? searchText : `${searchText} (opção ${index + 1})`;

          return {
            id: `${result.latitude}-${result.longitude}-${index}`,
            name: name,
            latitude: result.latitude,
            longitude: result.longitude,
            address: `Coordenadas: ${result.latitude.toFixed(4)}, ${result.longitude.toFixed(4)}`,
          };
        });

        setSearchResults(locationResults);

        // Se houver apenas um resultado, selecionar automaticamente
        if (locationResults.length === 1) {
          handleSelectSearchResult(locationResults[0]);
        }
      } else {
        Alert.alert(
          'Nenhum resultado',
          'Não encontramos nenhum local com esse nome. Tente:\n\n• Verificar a ortografia\n• Usar o nome de uma cidade conhecida\n• Tocar diretamente no mapa'
        );
      }
    } catch (error: any) {
      console.error('Erro ao pesquisar local:', error);

      let errorMessage = 'Não foi possível pesquisar o local.';

      if (error.message && error.message.includes('UNAVAILABLE')) {
        errorMessage = 'Serviço de pesquisa temporariamente indisponível. Tente:\n\n• Verificar sua conexão com a internet\n• Tocar diretamente no mapa\n• Tentar novamente em alguns segundos';
      } else if (error.message && error.message.includes('Network')) {
        errorMessage = 'Sem conexão com a internet. Verifique sua rede e tente novamente.';
      }

      Alert.alert('Erro na pesquisa', errorMessage);
    } finally {
      setIsSearching(false);
    }
  };

  // Selecionar um resultado da pesquisa
  const handleSelectSearchResult = (location: LocationResult) => {
    const newLocation: CoordinateType = {
      latitude: location.latitude,
      longitude: location.longitude,
    };

    setInitialRegion(newLocation);
    setSelectedLocation(newLocation);
    setSearchResults([]);

    // Mover câmera para o local escolhido
    setTimeout(() => {
      if (Platform.OS === 'android' && googleMapRef.current) {
        googleMapRef.current.setCameraPosition({
          coordinates: newLocation,
          zoom: 15,
        });
      } else if (Platform.OS === 'ios' && appleMapRef.current) {
        appleMapRef.current.setCameraPosition({
          coordinates: newLocation,
          zoom: 15,
        });
      }
    }, 300);
  };

  // Obter localização atual manualmente
  const handleGetCurrentLocation = async () => {
    setIsGettingLocation(true);

    try {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted') {
        Alert.alert(
          'Permissão negada',
          'Precisamos de permissão para acessar sua localização. Por favor, habilite nas configurações do dispositivo.'
        );
        setIsGettingLocation(false);
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
        timeInterval: 5000,
      });

      const userLocation: CoordinateType = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };

      setInitialRegion(userLocation);
      setSelectedLocation(userLocation);

      // Mover câmera para localização do usuário
      setTimeout(() => {
        if (Platform.OS === 'android' && googleMapRef.current) {
          googleMapRef.current.setCameraPosition({
            coordinates: userLocation,
            zoom: 15,
          });
        } else if (Platform.OS === 'ios' && appleMapRef.current) {
          appleMapRef.current.setCameraPosition({
            coordinates: userLocation,
            zoom: 15,
          });
        }
      }, 300);

    } catch (error: any) {
      console.error('Erro ao obter localização:', error);

      let errorMessage = 'Não foi possível obter sua localização.';

      if (error.message && error.message.includes('unavailable')) {
        errorMessage = 'Localização indisponível. Verifique se:\n\n• O GPS/Localização está ativado\n• Você está em um local aberto\n• Aguarde alguns segundos e tente novamente';
      }

      Alert.alert('Erro', errorMessage);
    } finally {
      setIsGettingLocation(false);
    }
  };

  // Confirmar localização e avançar
  const handleConfirmLocation = () => {
    if (!selectedLocation) {
      Alert.alert(
        'Escolha sua localização',
        'Toque no mapa para marcar o local da sua plantação.'
      );
      return;
    }

    speakIfEnabled('A seguir, perguntas sobre o solo.');

    navigation.navigate('SoilQuestions', {
      cropId,
      latitude: selectedLocation.latitude,
      longitude: selectedLocation.longitude,
    });
  };

  // Preparar marcadores para exibição
  const markers = selectedLocation ? [{
    coordinates: selectedLocation,
    title: "Minha plantação",
    snippet: "Local escolhido",
  }] : [];

  const annotations = selectedLocation ? [{
    coordinate: selectedLocation,
    title: "Minha plantação",
    subtitle: "Local escolhido",
  }] : [];

  // Preparar círculos para exibir área ao redor da localização
  const circles = selectedLocation ? [{
    center: selectedLocation,
    radius: 100, // 100 metros
    color: 'rgba(34, 197, 94, 0.2)', // Verde semi-transparente
    lineColor: 'rgba(34, 197, 94, 0.8)', // Verde mais forte para a borda
    lineWidth: 2,
  }] : [];

  if (Platform.OS === 'ios') {
    return (
      <SafeAreaView style={styles.container}>
        <MapHeader
          title='Localização da Plantação'
          subtitle='Pesquise ou toque no mapa para marcar seu local'
        />

        <LocationSearchBar
          searchText={searchText}
          onChangeText={setSearchText}
          onSearch={handleSearchLocation}
          isSearching={isSearching}
        />

        <LocationSearchResults
          results={searchResults}
          onSelectLocation={handleSelectSearchResult}
          onClose={() => setSearchResults([])}
        />

        <CurrentLocationButton
          onPress={handleGetCurrentLocation}
          isLoading={isGettingLocation}
        />

        <AppleMaps.View
          ref={appleMapRef}
          style={styles.map}
          annotations={annotations}
          circles={circles}
          onMapClick={handleMapClick}
          properties={{
            mapType: AppleMaps.MapType.IMAGERY,
          }}
          cameraPosition={{
            coordinates: initialRegion,
            zoom: 15,
          }}
        />

        <View style={styles.buttonContainer}>
          <NavigationButton
            title='Confirmar Local'
            onPress={handleConfirmLocation}
            disabled={!selectedLocation}
          />
        </View>
      </SafeAreaView>
    );
  } else if (Platform.OS === 'android') {
    return (
      <SafeAreaView style={styles.container}>
        <MapHeader
          title='Localização da Plantação'
          subtitle='Pesquise ou toque no mapa para marcar seu local'
        />

        <LocationSearchBar
          searchText={searchText}
          onChangeText={setSearchText}
          onSearch={handleSearchLocation}
          isSearching={isSearching}
        />

        <LocationSearchResults
          results={searchResults}
          onSelectLocation={handleSelectSearchResult}
          onClose={() => setSearchResults([])}
        />

        <CurrentLocationButton
          onPress={handleGetCurrentLocation}
          isLoading={isGettingLocation}
        />

        <GoogleMaps.View
          ref={googleMapRef}
          style={styles.map}
          properties={{
            mapType: GoogleMaps.MapType.SATELLITE,
          }}
          cameraPosition={{
            coordinates: initialRegion,
            zoom: 15,
          }}
          markers={markers}
          circles={circles}
          onMapClick={handleMapClick}
        />

        <View style={styles.buttonContainer}>
          <NavigationButton
            title='Confirmar Local'
            onPress={handleConfirmLocation}
            disabled={!selectedLocation}
          />
        </View>
      </SafeAreaView>
    );
  } else {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Mapas disponíveis apenas no celular (Android ou iPhone)</Text>
      </SafeAreaView>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  map: {
    flex: 1,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 32,
    left: 24,
    right: 24,
  },
});

