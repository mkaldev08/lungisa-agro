export type MapMarker = {
  id: string;
  coordinate: {
    latitude: number;
    longitude: number;
  };
  title?: string;
  description?: string;
};

export type RegionInfo = {
  province?: string;
  municipality?: string;
  area?: string;
};

export type MapRegion = {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
};

export interface MapHeaderProps {
  title: string;
  subtitle?: string;
}

export interface RegionInfoCardProps {
  province?: string;
  municipality?: string;
  area?: string;
}

export interface MapContainerProps {
  region: MapRegion;
  onRegionChange?: (region: MapRegion) => void;
  markers?: MapMarker[];
}
