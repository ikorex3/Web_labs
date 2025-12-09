import axios from 'https://cdn.jsdelivr.net/npm/axios@1.7.9/dist/esm/axios.min.js';

class HttpClient {
    constructor(baseURL = 'http://localhost:3001') {
        this.baseURL = baseURL;
        this.instance = axios.create({
            baseURL: this.baseURL,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }

    async get(url, params = {}) {
        try {
            const response = await this.instance.get(url, { params });
            return { data: response.data };
        } catch (error) {
            console.error('HTTP Error:', error.message);
            throw error;
        }
    }

    async post(url, data) {
        try {
            const response = await this.instance.post(url, data);
            return { data: response.data };
        } catch (error) {
            console.error('HTTP Error:', error.message);
            throw error;
        }
    }

    async put(url, data) {
        try {
            const response = await this.instance.put(url, data);
            return { data: response.data };
        } catch (error) {
            console.error('HTTP Error:', error.message);
            throw error;
        }
    }

    async delete(url) {
        try {
            const response = await this.instance.delete(url);
            return { data: response.data };
        } catch (error) {
            console.error('HTTP Error:', error.message);
            throw error;
        }
    }
}

const http = new HttpClient();
export default http;

