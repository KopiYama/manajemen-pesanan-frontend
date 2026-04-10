import axiosInstance from './axiosInstance';

export const getMenus = () => axiosInstance.get('/api/menu/menus');
export const getJenis = () => axiosInstance.get('/api/menu/jenis');
export const createMenu = (data) => axiosInstance.post('/api/menu/menus', data);
export const updateMenu = (id, data) => axiosInstance.put(`/api/menu/menus/${id}`, data);
export const deleteMenu = (id) => axiosInstance.delete(`/api/menu/menus/${id}`);
