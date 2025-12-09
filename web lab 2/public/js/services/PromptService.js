import http from '../api/http.js';
import Cache from '../utils/Cache.js';

class PromptService {
    constructor() {
        this.baseEndpoint = '/prompts';
        this.cache = new Cache();
    }

    async getPrompts(filters = {}) {
        const params = {};

        // Фільтри
        if (filters.aiModel && filters.aiModel !== 'Any') {
            params.aiModel = filters.aiModel;
        }
        if (filters.type && filters.type !== 'Any') {
            params.type = filters.type;
        }
        if (filters.rating && filters.rating !== 'Any') {
            const ratingValue = filters.rating.replace('★', '').replace(' or less', '').trim();
            params.rating_gte = parseInt(ratingValue);
        }
        if (filters.sortBy) {
            params._sort = filters.sortBy;
            params._order = filters.sortOrder || 'asc';
        }
        try {
            const cacheKey = JSON.stringify({ 
                ...params, 
                search: filters.search,
                priceRange: filters.priceRange,
                sortBy: filters.sortBy,
                sortOrder: filters.sortOrder
            });
            const cached = this.cache.get(this.baseEndpoint, { key: cacheKey });
            if (cached) {
                return cached;
            }
            const response = await http.get(this.baseEndpoint, params);
            let prompts = response.data;
            if (filters.search) {
                const searchTerm = filters.search.toLowerCase();
                prompts = prompts.filter(prompt => 
                    prompt.tags && prompt.tags.some(tag => tag.toLowerCase().includes(searchTerm))
                );
            }
            if (filters.priceRange && filters.priceRange !== 'Any') {
                prompts = this.filterByPriceRange(prompts, filters.priceRange);
            }
            this.cache.set(this.baseEndpoint, { key: cacheKey }, prompts);
            return prompts;
        } catch (error) {
            console.error('Error fetching prompts:', error);
            throw error;
        }
    }

    async getPromptById(id) {
        try {
            const endpoint = `${this.baseEndpoint}/${id}`;
            const cached = this.cache.get(endpoint);
            if (cached) {
                return cached;
            }

            const response = await http.get(endpoint);
            this.cache.set(endpoint, {}, response.data);

            return response.data;
        } catch (error) {
            console.error('Error fetching prompt:', error);
            throw error;
        }
    }

    filterByPriceRange(prompts, priceRange) {
        switch (priceRange) {
            case 'Under $5':
                return prompts.filter(p => p.price < 5);
            case '$5-$10':
                return prompts.filter(p => p.price >= 5 && p.price <= 10);
            case '$10-$20':
                return prompts.filter(p => p.price > 10 && p.price <= 20);
            default:
                return prompts;
        }
    }
}

export default PromptService;

