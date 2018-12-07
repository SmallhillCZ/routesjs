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
    constructor(instanceOptions) {
        this.instanceOptions = instanceOptions;
        this.routes = [];
        this.options = Object.assign({}, routesStore.options, instanceOptions);
        if (!this.options)
            throw new Error("You have to provide configuration");
        if (!this.options.url)
            throw new Error("You have to provide api root url");
        this.routes = routesStore.routes;
        this.router = express.Router(this.options.routerOptions);
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
        if (!path)
            throw new Error("Missing path");
        const routeDef = { method, resource, path, options };
        // save resource link
        const route = new route_1.Route(this, routeDef);
        this.routes.push(route);
        return route;
    }
}
exports.Routes = Routes;
//# sourceMappingURL=routes.js.map