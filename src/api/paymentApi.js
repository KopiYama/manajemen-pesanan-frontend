import axiosInstance from './axiosInstance';

/**
 * Get Midtrans Snap Token for an order
 * @param {Object} data { orderId, amount, customerName, customerEmail }
 */
export const getSnapToken = (data) => axiosInstance.post('/api/payment/snap', data);

/**
 * Mark order as paid by cash (Cashier functionality)
 * @param {string} orderId 
 * @param {number} amount 
 */
export const payByCash = (orderId, amount) => axiosInstance.put(`/api/payment/cash/${orderId}?amount=${amount}`);
