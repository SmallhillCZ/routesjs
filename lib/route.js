"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Route {
    constructor(routes, def) {
        this.routes = routes;
        this.method = def.method;
        this.path = def.path;
        this.resource = def.resource;
        this.href = this.routes.options.url + this.path.replace(/\/\:([^\/]+)(\/|$)/, "\/{$1}$2");
        this.options = def.options || {};
    }
    handle(handler) {
        const method = this.method.toLowerCase();
        const path = this.path;
        const defaultMiddleware = this.routes.options.middleware || [];
        const middleware = [...defaultMiddleware, ...arguments];
        if (middleware.length)
            this.routes.router[method](path, ...middleware);
    }
}
exports.Route = Route;
//# sourceMappingURL=route.js.map