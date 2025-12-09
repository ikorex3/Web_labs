class DetailView {
    constructor() {
        // Знаходимо елементи один раз при створенні
        this.mainContainer = document.getElementById('main-product-area');
        this.reviewsList = document.getElementById('reviews-list');
        this.popularGrid = document.getElementById('popular-prompts-grid');
        
        // Елементи для рейтингу в заголовку відгуків
        this.reviewAvgRating = document.getElementById('review-avg-rating');
        this.reviewStars = document.getElementById('review-stars');
    }

    // Рендер верхньої частини (картка товару)
    renderMain(prompt) {
        if (!this.mainContainer) return;

        const starsHTML = this.getRatingStars(prompt.rating);
        const tagsHTML = prompt.tags ? prompt.tags.map(tag => `#${tag}`).join(' ') : '';
        const bigImage = prompt.imageLarge || prompt.image;

        // Вставляємо HTML точно так, як було в верстці
        this.mainContainer.innerHTML = `
            <div class="prompt-detail__main">
                <div class="prompt-detail__image-wrapper">
                    <picture>
                        <source srcset="${bigImage}" media="(min-width: 600px)">
                        <img src="${prompt.image}" alt="${prompt.title}" class="prompt-detail__image">
                    </picture>
                </div>
                
                <div class="prompt-detail__info">
                    <h2 class="prompt-detail__title">${prompt.title}</h2>
                    
                    <div class="prompt-detail__rating">
                        <p class="prompt-detail__stars">${starsHTML}</p>
                        <span style="opacity: 0.7; margin-left: 8px;">(${prompt.reviews} reviews)</span>
                    </div>
                    
                    <div class="prompt-detail__purchase">
                        <button id="add-to-cart-btn" class="button button--primary prompt-detail__cart-btn">
                            Add to Cart
                        </button>
                        <p class="prompt-detail__price">$<span>${prompt.price.toFixed(2)}</span></p>
                    </div>
                    
                    <section class="prompt-detail__description">
                        <h3 class="prompt-detail__description-title">Prompt Description</h3>
                        <p class="prompt-detail__description-text">
                            ${prompt.description || 'No description provided.'}
                        </p>
                        <div style="margin-top: 15px; font-size: 0.9em; color: #ccc;">
                            <p><strong>AI Model:</strong> ${prompt.aiModel}</p>
                            <p><strong>Tags:</strong> ${tagsHTML}</p>
                        </div>
                    </section>
                </div>
            </div>
        `;
    }

    // Рендер відгуків
    renderReviews(prompt) {
        if (!this.reviewsList) return;

        // Оновлюємо загальний рейтинг біля заголовка
        if (this.reviewAvgRating) this.reviewAvgRating.textContent = prompt.rating;
        if (this.reviewStars) this.reviewStars.innerHTML = this.getRatingStars(prompt.rating);

        if (!prompt.reviewsList || prompt.reviewsList.length === 0) {
            this.reviewsList.innerHTML = '<p style="color: #888;">No reviews yet.</p>';
            return;
        }

        const html = prompt.reviewsList.map(review => `
            <article class="prompt-reviews__item">
                <div class="prompt-reviews__item-stars">${this.getRatingStars(review.rating)}</div>
                <p class="prompt-reviews__item-text">"${review.text}"</p>
            </article>
        `).join('');

        this.reviewsList.innerHTML = html;
    }

    // Рендер популярних товарів (картки)
    renderPopular(prompts) {
        if (!this.popularGrid) return;

        if (!prompts || prompts.length === 0) {
            this.popularGrid.innerHTML = '<p>No popular prompts found.</p>';
            return;
        }

        const html = prompts.map(prompt => {
            const stars = this.getRatingStars(prompt.rating);
            // Важливо: використовуємо ті самі класи, що і в catalog.js
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
                        <p class="product-card__tags"><small>${prompt.tags ? '#' + prompt.tags[0] : ''}</small></p>
                    </div>
                </article>
            `;
        }).join('');

        this.popularGrid.innerHTML = html;
    }

    getRatingStars(rating) {
        const full = Math.floor(rating);
        return '★'.repeat(full) + '☆'.repeat(5 - full);
    }

    showError(msg) {
        if (this.mainContainer) {
            this.mainContainer.innerHTML = `<h2 style="text-align:center; color: #ff6b6b;">${msg}</h2>`;
        }
    }
}

export default DetailView;