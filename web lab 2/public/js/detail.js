import PromptService from './services/PromptService.js';
import DetailView from './views/DetailView.js';
import URLParams from './utils/URLParams.js';

class DetailController {
    constructor() {
        this.promptService = new PromptService();
        this.view = new DetailView(); // Ініціалізуємо View
        this.init();
    }

    async init() {
        const id = URLParams.get('id');
        if (!id) {
            this.view.showError('Product ID not found');
            return;
        }

        await this.loadFullPage(id);
    }

    async loadFullPage(id) {
        try {
            // 1. Завантажуємо головний товар
            const product = await this.promptService.getPromptById(id);
            if (!product) {
                this.view.showError('Product not found');
                return;
            }

            // Рендеримо головну частину
            this.view.renderMain(product);
            
            // Рендеримо відгуки
            this.view.renderReviews(product);

            // Налаштовуємо кнопку кошика
            this.setupCartButton(product);

            // 2. Завантажуємо популярні (схожі) товари
            await this.loadPopular(id);

        } catch (error) {
            console.error(error);
            this.view.showError('Error loading details');
        }
    }

    async loadPopular(currentId) {
        try {
            // Беремо всі промпти і вибираємо 3-4 штуки, окрім поточного
            const all = await this.promptService.getPrompts();
            const popular = all
                .filter(p => p.id != currentId)
                .slice(0, 3); // Беремо 4 штуки, щоб заповнити ряд
            
            this.view.renderPopular(popular);
        } catch (e) {
            console.error('Popular load error:', e);
        }
    }

    setupCartButton(product) {
        const btn = document.getElementById('add-to-cart-btn');
        if (btn) {
            btn.addEventListener('click', () => {
                // 1. Логіка додавання в кошик (залишається без змін)
                let cart = JSON.parse(localStorage.getItem('cart')) || [];
                const exist = cart.find(i => i.id === product.id);
                if (exist) {
                    exist.quantity++;
                } else {
                    cart.push({ ...product, quantity: 1 });
                }
                localStorage.setItem('cart', JSON.stringify(cart));

                // 2. ВІЗУАЛЬНИЙ ЕФЕКТ (замість alert)
                const originalText = btn.textContent; // Запам'ятовуємо старий текст
                
                // Змінюємо вигляд кнопки
                btn.textContent = '✔ Added!';
                btn.style.backgroundColor = '#2ecc71'; // Зелений колір успіху
                btn.disabled = true; // Блокуємо, щоб не клікали багато разів

                // Через 1.5 секунди повертаємо все назад
                setTimeout(() => {
                    btn.textContent = originalText;
                    btn.style.backgroundColor = ''; // Скидаємо колір до CSS-стилю
                    btn.disabled = false;
                }, 1500);
            });
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new DetailController();
});