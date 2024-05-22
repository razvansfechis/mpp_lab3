import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000',
});

export const getCars = () => api.get('/cars');
export const getCar = (id) => api.get(`/car/${id}`);
export const createCar = (car) => api.post('/car', car);
export const updateCar = (id, car) => api.put(`/car/${id}`, car);
export const deleteCar = (id) => api.delete(`/car/${id}`);

export const getOwners = () => api.get('/owners');
export const getOwner = (id) => api.get(`/owner/${id}`);
export const createOwner = (owner) => api.post('/owner', owner);
export const updateOwner = (id, owner) => api.put(`/owner/${id}`, owner);
export const deleteOwner = (id) => api.delete(`/owner/${id}`);

export default api;