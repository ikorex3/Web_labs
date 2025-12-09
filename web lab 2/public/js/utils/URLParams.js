
class URLParams {
    static getAll() {
        const params = new URLSearchParams(window.location.search);
        const result = {};
        
        for (const [key, value] of params.entries()) {
            result[key] = value;
        }
        
        return result;
    }

    static get(key, defaultValue = '') {
        const params = new URLSearchParams(window.location.search);
        return params.get(key) || defaultValue;
    }

    static set(key, value) {
        const params = new URLSearchParams(window.location.search);
        
        if (value === '' || value === null || value === undefined) {
            params.delete(key);
        } else {
            params.set(key, value);
        }
        
        const newUrl = `${window.location.pathname}${params.toString() ? '?' + params.toString() : ''}`;
        window.history.pushState({}, '', newUrl);
    }

    static setMultiple(paramsObj) {
        const params = new URLSearchParams(window.location.search);
        
        Object.entries(paramsObj).forEach(([key, value]) => {
            if (value === '' || value === null || value === undefined) {
                params.delete(key);
            } else {
                params.set(key, value);
            }
        });
        
        const newUrl = `${window.location.pathname}${params.toString() ? '?' + params.toString() : ''}`;
        window.history.pushState({}, '', newUrl);
    }

    static clear() {
        window.history.pushState({}, '', window.location.pathname);
    }
}

export default URLParams;

