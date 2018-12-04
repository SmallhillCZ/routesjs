"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = __importStar(require("express"));
class Routes {
    constructor(options) {
        this.options = options;
        this.routes = [];
        if (!options)
            throw new Error("You have to provide configuration");
        if (!options.url)
            throw new Error("You have to provide api root url");
        this.options = options;
        this.routes = routesStore.routes;
        this.router = express.Router(options.routerOptions);
        this.router.get("/", this.serveApiRoot.bind(this));
    }
    get(resource, path, options) {
        return this.createRoute("get", resource, path, options);
    }
    post(resource, path, options) {
        return this.createRoute("post", resource, path, options);
    }
    put(resource, path, options) {
        return this.createRoute("put", resource, path, options);
    }
    patch(resource, path, options) {
        return this.createRoute("patch", resource, path, options);
    }
    delete(resource, path, options) {
        return this.createRoute("delete", resource, path, options);
    }
    createRoute(method, resource, path, options) {
        const routeDef = { method, resource, path, options };
        // save resource link
        const route = new RoutesRoute(this, routeDef);
        this.routes.push(route);
        return route;
    }
    serveApiRoot(req, res, next) {
        const api = Object.assign({}, this.options.info, { _links: {
                self: this.options.url
            } });
        for (let route of this.routes) {
            if (route.options.hidden)
                continue;
            api._links[route.resource] = {
                href: route.href
            };
        }
        res.json(api);
    }
    ;
}
exports.Routes = Routes;
class RoutesRoute {
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
//# sourceMappingURL=routes.js.map