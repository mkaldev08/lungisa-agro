import axios from 'axios';
import type { RecommendationRequest, RecommendationResponse } from '@/types/api';
import { API_CONFIG } from '@/config/api.config';

const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: 60000, // 60 seconds for Render cold starts
});

// Add response interceptor for better error logging
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Server responded with error
      console.error('API Error Response:', {
        status: error.response.status,
        data: error.response.data,
      });
    } else if (error.request) {
      // Request made but no response
      console.error('API No Response:', {
        url: error.config?.url,
        method: error.config?.method,
        baseURL: error.config?.baseURL,
      });
    } else {
      // Error setting up request
      console.error('API Request Setup Error:', error.message);
    }
    return Promise.reject(error);
  }
);

export const getRecommendation = async (
  request: RecommendationRequest
): Promise<RecommendationResponse> => {
  const response = await api.post<RecommendationResponse>('/recommendation', request);
  return response.data;
};

export const checkHealth = async (): Promise<{ status: string }> => {
  const response = await api.get('/health');
  return response.data;
};
