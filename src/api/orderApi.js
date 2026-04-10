import axiosInstance from './axiosInstance';

export const createOrder = (orderData) => axiosInstance.post('/api/orders', orderData);
export const getOrderById = (id) => axiosInstance.get(`/api/orders/${id}`);
