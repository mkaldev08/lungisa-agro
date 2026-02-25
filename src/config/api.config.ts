// For development
export const API_CONFIG = {
  BASE_URL: 'https://api-lungisa-agro-2.onrender.com',
};

// Helper to get the correct API URL based on platform
export const getApiUrl = () => {
  return API_CONFIG.BASE_URL;
};
