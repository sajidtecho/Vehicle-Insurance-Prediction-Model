import api from './api';

// Single Prediction
export const makeSinglePrediction = async (data) => {
  const response = await api.post('/api/predict/single', data);
  return response.data;
};

// Batch Prediction
export const makeBatchPrediction = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await api.post('/api/predict/batch', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

// Get Prediction History
export const getPredictionHistory = async (params = {}) => {
  const response = await api.get('/api/predictions/history', { params });
  return response.data;
};

// Export Predictions
export const exportPredictions = async (ids, format = 'csv') => {
  const response = await api.post('/api/predictions/export', 
    { ids, format },
    { responseType: 'blob' }
  );
  return response.data;
};

// Delete Prediction
export const deletePrediction = async (id) => {
  const response = await api.delete(`/api/predictions/${id}`);
  return response.data;
};

// Get Analytics Data
export const getAnalytics = async (period = '7days') => {
  const response = await api.get('/api/analytics', { params: { period } });
  return response.data;
};

// Get Dashboard Stats
export const getDashboardStats = async () => {
  const response = await api.get('/api/dashboard/stats');
  return response.data;
};
