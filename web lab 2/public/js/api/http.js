
class HttpClient {
    constructor(baseURL = 'http://localhost:3001') {
        this.baseURL = baseURL;
    }

    async request(url, options = {}) {
        const fullUrl = `${this.baseURL}${url}`;
        const config = {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        };

        try {
            const response = await fetch(fullUrl, config);
            
            if (!response.ok) {
                throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            return { data };
        } catch (error) {
            console.error('HTTP Error:', error.message);
            throw error;
        }
    }

    get(url, params = {}) {
        const queryString = new URLSearchParams(params).toString();
        const fullUrl = queryString ? `${url}?${queryString}` : url;
        return this.request(fullUrl, { method: 'GET' });
    }

    post(url, data) {
        return this.request(url, {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }

    put(url, data) {
        return this.request(url, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    }

    delete(url) {
        return this.request(url, { method: 'DELETE' });
    }
}

const http = new HttpClient();
export default http;

