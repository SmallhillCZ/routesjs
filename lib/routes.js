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
const routes_store_1 = require("./routes-store");
const functions_1 = require("./functions");
class Routes {
    constructor(instanceOptions) {
        this.instanceOptions = instanceOptions;
        this.routes = [];
        this.rootUrl = "/";
        this.options = instanceOptions || {};
        this.rootUrl = this.options.url || "/";
        this.routes = routes_store_1.routesStore.routes;
        const routerOptions = Object.assign({ mergeParams: true }, this.options.routerOptions);
        this.router = express.Router(routerOptions);
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
        if (!options)
            options = {};
        const routeDef = { method, resource, path, options };
        // save resource link
        const route = new route_1.Route(this, routeDef);
        this.routes.push(route);
        return route;
    }
    child(path, childRoutes) {
        // concatenate the path to set root for child
        childRoutes.rootUrl = this.rootUrl.replace(/\/$/, "") + functions_1.pathToTemplate(path);
        // bind to the router
        this.router.use(path, childRoutes.router);
    }
    static setACL(acl) {
        if (!acl.permissions)
            throw new Error("ACLOptions are missing permissions parameter");
        if (!acl.userRoles)
            throw new Error("ACLOptions are missing userRoles parameter");
        Object.assign(routes_store_1.routesStore.acl, acl);
    }
    static setOptions(options) {
        Object.assign(routes_store_1.routesStore.options, options);
    }
}
exports.Routes = Routes;
//# sourceMappingURL=routes.js.map