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
        this.router = express.Router();
        this.options = options;
        if (!options)
            throw new Error("You have to provide configuration for the router as a second parmeter");
        if (!options.root)
            throw new Error("You have to provide api root url");
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
        const href = this.options.root + path.replace(/\/\:([^\/]+)(\/|$)/, "\/{$1}$2");
        // save resource link
        const route = new RoutesRoute(this.router, method, resource, path, href, {
            query: options && options.query
        });
        this.routes.push(route);
        return route;
    }
    serveRssources(req, res, next) {
        const resources = {};
        for (let route of routesStore.routes) {
            if (route.options.hidden)
                continue;
            const [resource, link = "self"] = route.resource.split(":");
            if (!resources[resource])
                resources[resource] = { _links: {} };
            resources[resource]._links[link] = {
                href: route.href
            };
        }
        res.json(resources);
    }
    ;
}
exports.Routes = Routes;
class RoutesRoute {
    constructor(router, method, resource, path, href, options) {
        this.router = router;
        this.method = method;
        this.resource = resource;
        this.path = path;
        this.href = href;
        this.options = options;
        this.queryParsed = options.query ? mongoParser.parse(options.query) : undefined;
    }
    handle(handler) {
        const method = this.method.toLowerCase();
        const path = this.path;
        const middleware = arguments;
        if (middleware.length)
            this.router[method](path, ...middleware);
    }
}
//# sourceMappingURL=router.js.map