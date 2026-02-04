import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: "http://localhost:8000",
    timeout: 100000, // 100 seconds timeout
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
});

axiosInstance.interceptors.request.use(
    (config) => {
        const accessToken = localStorage.getItem('token');
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response Interceptor

axiosInstance.interceptors.response.use(
    
    (response) => {
        return response;
    },
    (error) => {
        if (error.response) {
            if (error.response.status === 401) {
                // Handle unauthorized access
                window.location.href = '/login'; // Redirect to login page
            }
            else if (error.response.status === 500) {
                console.error('Server error occurred please try again later.');
            }
            else if (error.code === 'ECONNABORTED') {
                console.error('Request timed out. Please try again later.')
            }
        }
        return Promise.reject(error);
    });

 export default axiosInstance 

