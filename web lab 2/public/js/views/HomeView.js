class HomeView {
    constructor() {
        this.container = document.getElementById('home-popular-grid');
    }

    renderPopular(prompts) {
        if (!this.container) return;

        if (!prompts || prompts.length === 0) {
            this.container.innerHTML = '<p>No popular prompts found.</p>';
            return;
        }

        const html = prompts.map(prompt => {
            const stars = this.getRatingStars(prompt.rating);
            // Беремо перший тег або пустий рядок, якщо тегів немає
            const firstTag = prompt.tags && prompt.tags.length > 0 ? `#${prompt.tags[0]}` : '';
            const secondTag = prompt.tags && prompt.tags.length > 1 ? `#${prompt.tags[1]}` : '';

            return `
                <article class="product-card">
                    <a href="/prompt?id=${prompt.id}" class="product-card__link">
                        <img src="${prompt.image}" alt="${prompt.title}" class="product-card__image">
                    </a>
                    <div class="product-card__overlay">
                        <div class="product-card__info-row">
                            <p class="product-card__price">$${prompt.price.toFixed(2)}</p> 
                            <p class="product-card__rating">${stars}</p>   
                        </div>
                        <p class="product-card__tags"><small>${firstTag} ${secondTag}</small></p>
                    </div>
                </article>
            `;
        }).join('');

        this.container.innerHTML = html;
    }

    getRatingStars(rating) {
        const full = Math.floor(rating);
        return '★'.repeat(full) + '☆'.repeat(5 - full);
    }
}

export default HomeView;