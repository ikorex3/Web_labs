const axios = require('axios');

// Базовий URL для json-server
const BASE_URL = 'http://localhost:3001';

// Створюємо базовий axios instance з налаштуваннями
const http = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Додаємо interceptor для обробки помилок
http.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('HTTP Error:', error.message);
        return Promise.reject(error);
    }
);

module.exports = http;

