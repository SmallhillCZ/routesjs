"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Route {
    constructor(routes, def) {
        this.routes = routes;
        this.method = def.method;
        this.path = def.path;
        this.resource = def.resource;
        this.href = this.routes.options.url + this.path.replace(/\/\:([^\/]+)(\/|$)/, "\/{$1}$2");
        this.href = this.href.replace(/\/$/, ""); // remove trailing slash
        this.options = def.options || {};
    }
    routesMiddleware(req, res, next) {
        req.routes = {
            route: this
        };
        next();
    }
    handle(handler) {
        const method = this.method.toLowerCase();
        const path = this.path;
        const globalMiddleware = this.routes.options.middleware || [];
        const middleware = [this.routesMiddleware.bind(this), ...globalMiddleware, ...arguments];
        if (middleware.length)
            this.routes.router[method](path, ...middleware);
    }
}
exports.Route = Route;
//# sourceMappingURL=route.js.map