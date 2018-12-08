"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const links_1 = require("./links");
const acl_1 = require("./acl");
const functions_1 = require("./functions");
const mongoParser = __importStar(require("mongo-parse"));
class Route {
    constructor(routes, def) {
        this.routes = routes;
        this.method = def.method;
        this.path = def.path;
        this.resourceString = def.resource;
        if (def.resource) {
            const [, resource, link] = def.resource.match(/([^\:]+)\:?(.+)?/);
            this.resource = resource;
            this.link = link;
        }
        // convert express path to URI Template and remove trailing slash
        this.href = functions_1.pathToTemplate(this.path).replace(/\/$/, "");
        /* optional route options */
        this.query = def.options.query ? mongoParser.parse(def.options.query) : undefined;
        this.permission = def.options.permission;
        this.hideRoot = def.options.hideRoot;
        this.hideDocs = def.options.hideDocs;
        if (this.permission && !acl_1.RoutesACL.isPermission(this.permission))
            throw new Error("Permission " + this.permission + " is not defined.");
        if (!this.permission)
            console.log("Routes warning: No defined permission for route " + this.href);
    }
    getHref() {
        return this.routes.rootUrl + this.href;
    }
    routesAccessMiddleware(req, res, next) {
        if (!acl_1.RoutesACL.canRoute(this, req))
            return res.sendStatus(401);
        else
            return next();
    }
    routesReqMiddleware(req, res, next) {
        req.routes = {
            route: this,
            routes: this.routes
        };
        req.links = (docs, resource) => links_1.RoutesLinks(docs, resource, req);
        next();
    }
    handle(handler) {
        const method = this.method.toLowerCase();
        const path = this.path;
        const middleware = [
            this.routesAccessMiddleware.bind(this),
            this.routesReqMiddleware.bind(this),
            ...arguments
        ];
        if (middleware.length)
            this.routes.router[method](path, ...middleware);
    }
}
exports.Route = Route;
//# sourceMappingURL=route.js.map