export type CropId = 'maize' | 'tomato' | 'cabbage' | 'coffee';

export type SoilType = 'acidic' | 'sandy' | 'medium';

export interface SoilAnswer {
  questionId: string;
  optionId: string;
}

export interface DosePerHole {
  gramsPerHole: number;
  spoonsPerHole: number;
  spoonSizeGrams: number;
  plantDensityPerHa: number;
}

export interface BagsConversion {
  bagWeightKg: number;
  bagsExact: number;
  bagsRounded: number;
}

export interface RecommendationResult {
  crop: CropId;
  provinceId?: string;
  soilType: SoilType;
  fertilizer: string;
  baseRateKgHa: number;
  totalKg: number;
  bags25kg: BagsConversion;
  perHoleDose?: DosePerHole;
  timing: string;
  notes: string[];
  reasoning: string[];
  assumptions: string[];
}

export interface SoilData {
  id: string;
  latitude: number;
  longitude: number;
  sand: number;
  silt: number;
  clay: number;
  ph: number;
  organic_carbon: number;
  classification: string;
}

export interface RecommendationRequest {
  crop: CropId;
  lat: number;
  lon: number;
  areaHa: number;
  answers: SoilAnswer[];
  provinceId?: string;
}

export interface RecommendationResponse {
  soil: SoilData;
  recommendation: RecommendationResult;
}
