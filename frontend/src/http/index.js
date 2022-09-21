import axios from 'axios';

const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    withCredentials: true,
    headers: {
        'Content-type': 'application/json',
        Accept: 'application/json',
    },
});

// All the endPoints
export const sendOtp = (data) => api.post('/api/otp/send', data);
export const verifyOtp = (data) => api.post('/api/otp/verify', data);
export const activate = (data) => api.post('/api/activate', data);
export const login = (data) => api.post('/api/login', data);
export const forgot = (data) => api.put('/api/login/forgot', data);
export const verifyLink = (token) => api.get(`/api/login/verifyLink/${token}`);
export const reset = (data) => api.put(`/api/login/reset/${data.token}`, data);
export const logout = () => api.post('/api/logout');
export const createRoom = (data) => api.post('/api/rooms', data);
export const getAllRooms = () => api.get('/api/rooms');
export const getRoom = (roomId) => api.get(`/api/room/${roomId}`);

// Interceptors
api.interceptors.response.use(
    (config) => {
        return config;
    },
    async (error) => {
        const originalRequest = error.config;
        if (
            error.response.status === 401 &&
            originalRequest &&
            !originalRequest._isRetry
        ) {
            originalRequest._isRetry = true;
            try {
                await axios.get(
                    `${process.env.REACT_APP_API_URL}/api/refresh`,
                    {
                        withCredentials: true,
                    }
                );

                return api.request(originalRequest);
            } catch (err) {
                console.log(err.message);
            }
        }
        throw error;
    }
);

export default api;