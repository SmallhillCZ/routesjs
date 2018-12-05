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
const route_1 = require("./route");
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
        const route = new route_1.Route(this, routeDef);
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
//# sourceMappingURL=routes.js.map