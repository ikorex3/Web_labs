
class Paginator {
    constructor(options = {}) {
        this.currentPage = options.currentPage || 1;
        this.itemsPerPage = options.itemsPerPage || 12;
        this.totalItems = options.totalItems || 0;
        this.onPageChange = options.onPageChange || null;
        this.containerSelector = options.containerSelector || '.pagination';
        this.container = null;
    }

    setTotalItems(total) {
        this.totalItems = total;
        this.render();
    }

    setCurrentPage(page) {
        this.currentPage = page;
        this.render();
    }

    getCurrentPage() {
        return this.currentPage;
    }

    getTotalPages() {
        return Math.ceil(this.totalItems / this.itemsPerPage);
    }

    render() {
        this.container = document.querySelector(this.containerSelector);
        if (!this.container) {
            return;
        }

        const totalPages = this.getTotalPages();
        
        if (totalPages <= 1) {
            this.container.innerHTML = '';
            return;
        }

        let html = '<div class="pagination__wrapper">';
        
        html += `<button class="pagination__btn" ${this.currentPage === 1 ? 'disabled' : ''} data-page="${this.currentPage - 1}">Previous</button>`;
        
        const maxVisible = 5;
        let startPage = Math.max(1, this.currentPage - Math.floor(maxVisible / 2));
        let endPage = Math.min(totalPages, startPage + maxVisible - 1);
        
        if (endPage - startPage < maxVisible - 1) {
            startPage = Math.max(1, endPage - maxVisible + 1);
        }
        
        if (startPage > 1) {
            html += `<button class="pagination__btn" data-page="1">1</button>`;
            if (startPage > 2) {
                html += `<span class="pagination__ellipsis">...</span>`;
            }
        }
        
        for (let i = startPage; i <= endPage; i++) {
            html += `<button class="pagination__btn ${i === this.currentPage ? 'pagination__btn--active' : ''}" data-page="${i}">${i}</button>`;
        }
        
        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                html += `<span class="pagination__ellipsis">...</span>`;
            }
            html += `<button class="pagination__btn" data-page="${totalPages}">${totalPages}</button>`;
        }
        
        html += `<button class="pagination__btn" ${this.currentPage === totalPages ? 'disabled' : ''} data-page="${this.currentPage + 1}">Next</button>`;
        
        html += '</div>';
        this.container.innerHTML = html;
        
        this.container.querySelectorAll('.pagination__btn:not([disabled])').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const page = parseInt(e.target.dataset.page);
                if (page && page !== this.currentPage && this.onPageChange) {
                    this.onPageChange(page);
                }
            });
        });
    }

    reset() {
        this.currentPage = 1;
        this.totalItems = 0;
        this.render();
    }
}

export default Paginator;

