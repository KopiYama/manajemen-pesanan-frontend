import axiosInstance from './axiosInstance';

export const getKitchenQueue = () => axiosInstance.get('/api/kitchen/queue');
export const getKitchenInProgress = () => axiosInstance.get('/api/kitchen/in-progress');
export const getKitchenReady = () => axiosInstance.get('/api/kitchen/ready');

// Update Status berdasarkan Dokumentasi Baru
export const processOrder = (id) => axiosInstance.put(`/api/kitchen/queue/${id}/process`);
export const readyOrder = (id) => axiosInstance.put(`/api/kitchen/in-progress/${id}/ready`);
export const completeOrder = (id) => axiosInstance.put(`/api/kitchen/ready/${id}/complete`);

// Keep this for compatibility if needed, but we should use specific functions above
export const updateOrderStatus = (id, status) => {
  if (status === 'IN_PROGRESS') return processOrder(id);
  if (status === 'READY_TO_SERVE') return readyOrder(id);
  if (status === 'COMPLETED') return completeOrder(id);
  return Promise.reject(new Error('Invalid status transition'));
};
