
class Cache {
    constructor() {
        this.cachePrefix = 'api_cache_';
        this.defaultTTL = 5 * 60 * 1000;
    }
    createKey(url, params = {}) {
        const sortedParams = Object.keys(params)
            .sort()
            .map(key => `${key}=${params[key]}`)
            .join('&');
        return `${this.cachePrefix}${url}${sortedParams ? '?' + sortedParams : ''}`;
    }

    get(url, params = {}) {
        try {
            const key = this.createKey(url, params);
            const cached = localStorage.getItem(key);
            
            if (!cached) {
                return null;
            }

            const { data, timestamp, ttl } = JSON.parse(cached);
            const now = Date.now();
            const cacheAge = now - timestamp;
            const cacheTTL = ttl || this.defaultTTL;
            if (cacheAge > cacheTTL) {
                localStorage.removeItem(key);
                return null;
            }

            return data;
        } catch (error) {
            console.error('Error reading from cache:', error);
            return null;
        }
    }

    set(url, params = {}, data, ttl = null) {
        try {
            const key = this.createKey(url, params);
            const cacheData = {
                data,
                timestamp: Date.now(),
                ttl: ttl || this.defaultTTL
            };
            localStorage.setItem(key, JSON.stringify(cacheData));
        } catch (error) {
            console.error('Error saving to cache:', error);
            this.clearOldEntries();
        }
    }

    clearOldEntries() {
        try {
            const keys = Object.keys(localStorage);
            const now = Date.now();
            
            keys.forEach(key => {
                if (key.startsWith(this.cachePrefix)) {
                    try {
                        const cached = localStorage.getItem(key);
                        if (cached) {
                            const { timestamp, ttl } = JSON.parse(cached);
                            const cacheTTL = ttl || this.defaultTTL;
                            if (now - timestamp > cacheTTL) {
                                localStorage.removeItem(key);
                            }
                        }
                    } catch (e) {
                        localStorage.removeItem(key);
                    }
                }
            });
        } catch (error) {
            console.error('Error clearing old cache entries:', error);
        }
    }
}

export default Cache;

