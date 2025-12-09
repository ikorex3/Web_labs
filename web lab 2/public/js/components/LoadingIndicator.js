
class LoadingIndicator {
    constructor(containerSelector) {
        this.container = document.querySelector(containerSelector);
        this.indicator = null;
    }

    showLoading() {
        this.hide();
        this.indicator = document.createElement('div');
        this.indicator.className = 'loading-indicator';
        this.indicator.innerHTML = '<div class="loading-spinner"></div><p>Loading...</p>';
        if (this.container) {
            this.container.appendChild(this.indicator);
        }
    }

    showError(message = 'An error occurred. Please try again.') {
        this.hide();
        this.indicator = document.createElement('div');
        this.indicator.className = 'error-indicator';
        this.indicator.innerHTML = `<p>${message}</p>`;
        if (this.container) {
            this.container.appendChild(this.indicator);
        }
    }

    hide() {
        if (this.indicator) {
            this.indicator.remove();
            this.indicator = null;
        }
    }
}

export default LoadingIndicator;

