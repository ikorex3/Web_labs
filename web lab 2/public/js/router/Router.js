class Router {
    constructor() {
        this.routes = {};
        this.currentRoute = null;
        this.init();
    }

    init() {
        window.addEventListener('hashchange', () => this.handleRoute());
        this.handleRoute();
    }

    route(path, handler) {
        this.routes[path] = handler;
    }

    handleRoute() {
        const hash = window.location.hash.slice(1) || '/list';
        const fullPath = hash.startsWith('/') ? hash : `/${hash}`;
        for (const [routePath, handler] of Object.entries(this.routes)) {
            const routeRegex = this.pathToRegex(routePath);
            const match = fullPath.match(routeRegex);
            
            if (match) {
                const routeParams = this.extractParams(routePath, match);
                this.currentRoute = { path: fullPath, params: routeParams };
                handler(routeParams);
                return;
            }
        }
        if (fullPath !== '/list') {
            this.navigate('/list');
        }
    }

    pathToRegex(path) {
        const pattern = path
            .replace(/\//g, '\\/')
            .replace(/:(\w+)/g, '([^/]+)');
        return new RegExp(`^${pattern}$`);
    }

    extractParams(routePath, match) {
        const params = {};
        const paramNames = routePath.match(/:(\w+)/g);
        
        if (paramNames) {
            paramNames.forEach((param, index) => {
                const name = param.slice(1);
                params[name] = match[index + 1];
            });
        }
        
        return params;
    }

    navigate(path) {
        window.location.hash = path;
    }

}

export default Router;

