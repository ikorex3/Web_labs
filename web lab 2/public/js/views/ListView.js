class ListView {
    constructor(containerSelector) {
        this.container = document.querySelector(containerSelector);
        if (!this.container) {
            throw new Error(`Container not found: ${containerSelector}`);
        }
    }

    clear() {
        this.container.innerHTML = '';
    }

    render(prompts) {
        if (!prompts || prompts.length === 0) {
            this.renderEmpty();
            return;
        }

        prompts.forEach(prompt => {
            const card = this.createCard(prompt);
            this.container.appendChild(card);
        });
    }

    append(prompts) {
        if (!prompts || prompts.length === 0) {
            return;
        }

        prompts.forEach(prompt => {
            const card = this.createCard(prompt);
            this.container.appendChild(card);
        });
    }

    createCard(prompt) {
        const article = document.createElement('article');
        article.className = 'product-card product-card--catalog';
        
        const ratingStars = this.getRatingStars(prompt.rating);
        const tags = prompt.tags ? prompt.tags.map(tag => `#${tag}`).join(' ') : '';

        article.innerHTML = `
            <a href="#/item/${prompt.id}" class="product-card__link">
                <img src="${prompt.image}" alt="${prompt.title}" class="product-card__image">
            </a>
            <div class="product-card__overlay">
                <div class="product-card__info-row">
                    <p class="product-card__price">$${prompt.price.toFixed(2)}</p>
                    <p class="product-card__rating">${ratingStars}</p>
                </div>
                <p class="product-card__tags"><small>${tags}</small></p>
            </div>
        `;

        return article;
    }

    renderEmpty() {
        this.container.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 2rem;">
                <p>No prompts found. Try adjusting your filters.</p>
            </div>
        `;
    }

    getRatingStars(rating) {
        const fullStars = Math.floor(rating);
        const emptyStars = 5 - fullStars;
        return '★'.repeat(fullStars) + '☆'.repeat(emptyStars);
    }
}

export default ListView;

