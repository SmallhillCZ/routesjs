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
const routes_store_1 = require("./routes-store");
const mongoParser = __importStar(require("mongo-parse"));
class Route {
    constructor(routes, def) {
        this.routes = routes;
        this.method = def.method;
        this.path = def.path;
        const [, resource, link] = def.resource.match(/([^\:]+)\:?(.+)?/);
        this.resource = resource;
        this.link = link;
        this.href = this.routes.options.url + this.path.replace(/\:([^\/]+)/g, "{$1}");
        this.href = this.href.replace(/\/$/, ""); // remove trailing slash
        /* optional route options */
        this.query = def.options.query ? mongoParser.parse(def.options.query) : undefined;
        this.access = def.options.access;
        this.hideRoot = def.options.hideRoot;
        this.hideDocs = def.options.hideDocs;
    }
    routesAccessMiddleware(req, res, next) {
        if (!this.access)
            return this.accessContinue(req, res, next);
        if (routes_store_1.RoutesStore.options.asyncAccess) {
            this.access(req).then(result => !!result ? this.accessContinue(req, res, next) : this.accessError(req, res, next)).catch(this.accessError(req, res, next));
        }
        else {
            if (!!this.access(req))
                this.accessContinue(req, res, next);
            else
                this.accessError(req, res, next);
        }
    }
    accessError(req, res, next) {
        res.sendStatus(401);
    }
    accessContinue(req, res, next) {
        next();
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
            this.routesReqMiddleware.bind(this),
            this.routesAccessMiddleware.bind(this),
            ...arguments
        ];
        if (middleware.length)
            this.routes.router[method](path, ...middleware);
    }
}
exports.Route = Route;
//# sourceMappingURL=route.js.map