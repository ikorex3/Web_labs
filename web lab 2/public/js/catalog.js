import PromptService from './services/PromptService.js';
import ListView from './views/ListView.js';
import Paginator from './components/Paginator.js';
import URLParams from './utils/URLParams.js';
import LoadingIndicator from './components/LoadingIndicator.js';
import Router from './router/Router.js';

class CatalogController {
    constructor() {
        this.promptService = new PromptService();
        this.listView = new ListView('.catalog-grid--catalog');
        this.loadingIndicator = new LoadingIndicator('.catalog-grid--catalog');
        this.paginator = new Paginator({
            itemsPerPage: 10,
            containerSelector: '.pagination',
            onPageChange: (page) => this.loadPage(page)
        });
        this.allPrompts = [];
        
        this.filters = {
            search: '',
            aiModel: 'Any',
            type: 'Any',
            priceRange: 'Any',
            rating: 'Any',
            sortBy: 'id',
            sortOrder: 'asc'
        };

        this.init();
    }

    init() {
        this.loadFiltersFromURL();
        this.setupEventListeners();
        this.setupFormValidation();
        this.loadInitialData();
    }


    loadFiltersFromURL() {
        this.filters.search = URLParams.get('search', '');
        this.filters.aiModel = URLParams.get('aiModel', 'Any');
        this.filters.type = URLParams.get('type', 'Any');
        this.filters.priceRange = URLParams.get('priceRange', 'Any');
        this.filters.rating = URLParams.get('rating', 'Any');
        this.filters.sortBy = URLParams.get('sortBy', 'id');
        this.filters.sortOrder = URLParams.get('sortOrder', 'asc');
        this.updateFormValues();
    }


    updateFormValues() {
        const searchInput = document.getElementById('catalog-search');
        const aiModelSelect = document.getElementById('ai-model');
        const typeSelect = document.getElementById('type');
        const priceRangeSelect = document.getElementById('price-range');
        const ratingSelect = document.getElementById('rating');
        const sortBySelect = document.getElementById('sortBy');
        const sortOrderSelect = document.getElementById('sortOrder');

        if (searchInput) searchInput.value = this.filters.search;
        if (aiModelSelect) aiModelSelect.value = this.filters.aiModel;
        if (typeSelect) typeSelect.value = this.filters.type;
        if (priceRangeSelect) priceRangeSelect.value = this.filters.priceRange;
        if (ratingSelect) ratingSelect.value = this.filters.rating;
        if (sortBySelect) sortBySelect.value = this.filters.sortBy;
        if (sortOrderSelect) sortOrderSelect.value = this.filters.sortOrder;
    }


    setupEventListeners() {
        const filterForm = document.getElementById('filters');
        const searchInput = document.getElementById('catalog-search');

        if (filterForm) {
            filterForm.addEventListener('change', (e) => {
                if (e.target.tagName === 'SELECT') {
                    this.handleFilterChange(e.target.id, e.target.value);
                }
            });
        }

        if (searchInput) {
            let searchTimeout;
            searchInput.addEventListener('input', (e) => {
                this.validateField(e.target);
                clearTimeout(searchTimeout);
                searchTimeout = setTimeout(() => {
                    this.handleFilterChange('catalog-search', e.target.value);
                }, 500); // Debounce 500ms
            });
            searchInput.addEventListener('blur', (e) => {
                this.validateField(e.target);
            });
        }
    }

 
    setupFormValidation() {
        this.loadFormFromLocalStorage();
    }

    validateField(input) {
        const errorElement = document.getElementById(`${input.name || input.id}-error`);
        let isValid = true;
        let errorMessage = '';

        if (input.hasAttribute('pattern') && input.value) {
            const pattern = new RegExp(input.getAttribute('pattern'));
            if (!pattern.test(input.value)) {
                isValid = false;
                errorMessage = 'Invalid format. Use only letters, numbers, spaces, and #';
            }
        }

        if (input.hasAttribute('maxlength') && input.value.length > parseInt(input.getAttribute('maxlength'))) {
            isValid = false;
            errorMessage = `Maximum length is ${input.getAttribute('maxlength')} characters`;
        }

        if (errorElement) {
            if (isValid) {
                errorElement.textContent = '';
                input.classList.remove('error');
            } else {
                errorElement.textContent = errorMessage;
                input.classList.add('error');
            }
        }

        return isValid;
    }

    saveFormToLocalStorage() {
        try {
            const formData = {
                search: this.filters.search,
                aiModel: this.filters.aiModel,
                type: this.filters.type,
                priceRange: this.filters.priceRange,
                rating: this.filters.rating,
                sortBy: this.filters.sortBy,
                sortOrder: this.filters.sortOrder
            };
            localStorage.setItem('catalogFilters', JSON.stringify(formData));
        } catch (error) {
            console.error('Error saving to localStorage:', error);
        }
    }

    loadFormFromLocalStorage() {
        try {
            const savedData = localStorage.getItem('catalogFilters');
            if (savedData && !window.location.search) {
                const formData = JSON.parse(savedData);
                this.filters = { ...this.filters, ...formData };
                this.updateFormValues();
            }
        } catch (error) {
            console.error('Error loading from localStorage:', error);
        }
    }

    handleFilterChange(filterName, value) {
        const filterMap = {
            'ai-model': 'aiModel',
            'type': 'type',
            'price-range': 'priceRange',
            'rating': 'rating',
            'catalog-search': 'search',
            'sortBy': 'sortBy',
            'sortOrder': 'sortOrder'
        };

        const filterKey = filterMap[filterName] || filterName;
        this.filters[filterKey] = value;

        URLParams.set(filterKey, value === 'Any' ? '' : value);

        this.saveFormToLocalStorage();

        this.resetAndLoad();
    }

    async loadInitialData() {
        this.loadingIndicator.showLoading();
        this.paginator.reset();
        await this.loadPage(1);
    }

    async loadAllPrompts() {
        try {
            this.loadingIndicator.showLoading();
            const allPrompts = await this.promptService.getPrompts({
                ...this.filters,
                sortBy: this.filters.sortBy,
                sortOrder: this.filters.sortOrder
            });

            this.allPrompts = allPrompts;
            return allPrompts;
        } catch (error) {
            console.error('Error loading prompts:', error);
            this.loadingIndicator.hide();
            this.loadingIndicator.showError('Failed to load prompts. Please try again.');
            return [];
        }
    }

    async loadPage(page) {
        try {
            this.loadingIndicator.showLoading();
            if (page === 1 || this.allPrompts.length === 0) {
                await this.loadAllPrompts();
            }

            const startIndex = (page - 1) * this.paginator.itemsPerPage;
            const endIndex = startIndex + this.paginator.itemsPerPage;
            const prompts = this.allPrompts.slice(startIndex, endIndex);

            this.loadingIndicator.hide();
            this.listView.clear();

            if (prompts.length > 0) {
                this.listView.render(prompts);
                this.paginator.setTotalItems(this.allPrompts.length);
                this.paginator.setCurrentPage(page);
            } else {
                this.listView.renderEmpty();
                this.paginator.setTotalItems(0);
            }
        } catch (error) {
            console.error('Error loading page:', error);
            this.loadingIndicator.hide();
            this.loadingIndicator.showError('Failed to load prompts. Please try again.');
        }
    }

    resetAndLoad() {
        this.allPrompts = [];
        this.paginator.reset();
        this.loadPage(1);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const router = new Router();
    let catalogController = null;

    router.route('/list', () => {
        if (!catalogController && document.querySelector('.catalog-grid--catalog')) {
            catalogController = new CatalogController();
        }
        if (catalogController) {
            catalogController.loadFiltersFromURL();
            catalogController.resetAndLoad();
        }
    });

    router.route('/item/:id', (params) => {
        window.location.href = `/prompt?id=${params.id}`;
    });

    if (!window.location.hash) {
        router.navigate('/list');
    }
});

export default CatalogController;

