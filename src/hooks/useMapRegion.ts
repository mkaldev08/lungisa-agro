import { useState } from 'react';
import { Region } from 'react-native-maps';
import { MAP_REGIONS } from '@/constants/map';
import { MapMarker, RegionInfo } from '@/types/map';

interface UseMapRegionReturn {
  currentRegion: Region;
  selectedInfo: RegionInfo;
  markers: MapMarker[];
  handleRegionChange: (region: Region) => void;
  setSelectedInfo: (info: RegionInfo) => void;
  addMarker: (marker: MapMarker) => void;
  removeMarker: (markerId: string) => void;
}

export const useMapRegion = (
  initialRegion: Region = MAP_REGIONS.ANGOLA
): UseMapRegionReturn => {
  const [currentRegion, setCurrentRegion] = useState<Region>(initialRegion);
  const [selectedInfo, setSelectedInfo] = useState<RegionInfo>({
    province: 'Luanda',
    municipality: '',
    area: '',
  });
  const [markers, setMarkers] = useState<MapMarker[]>([]);

  const handleRegionChange = (region: Region) => {
    setCurrentRegion(region);
    // Add logic to update location info based on region coordinates
  };

  const addMarker = (marker: MapMarker) => {
    setMarkers((prev) => [...prev, marker]);
  };

  const removeMarker = (markerId: string) => {
    setMarkers((prev) => prev.filter((marker) => marker.id !== markerId));
  };

  return {
    currentRegion,
    selectedInfo,
    markers,
    handleRegionChange,
    setSelectedInfo,
    addMarker,
    removeMarker,
  };
};
