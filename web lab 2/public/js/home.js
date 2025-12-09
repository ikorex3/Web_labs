import PromptService from './services/PromptService.js';
import HomeView from './views/HomeView.js';

class HomeController {
    constructor() {
        this.promptService = new PromptService();
        this.view = new HomeView();
        this.init();
    }

    async init() {
        await this.loadPopularPrompts();
    }

    async loadPopularPrompts() {
        try {
            // Отримуємо товари. 
            // Якщо у вас json-server підтримує сортування, можна додати параметри:
            // const prompts = await this.promptService.getPrompts({ _sort: 'rating', _order: 'desc', _limit: 4 });
            
            // Але використаємо стандартний метод і відфільтруємо вручну, як робили раніше:
            const allPrompts = await this.promptService.getPrompts();
            
            // Беремо перші 4 товари для гарної сітки (або 5, якщо хочете як було)
            const popularPrompts = allPrompts.slice(0, 5); 

            this.view.renderPopular(popularPrompts);
        } catch (error) {
            console.error('Error loading home prompts:', error);
            if(this.view.container) {
                this.view.container.innerHTML = '<p>Failed to load prompts.</p>';
            }
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new HomeController();
});