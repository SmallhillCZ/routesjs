"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const routes_1 = require("./routes");
const links_1 = require("./links");
const acl_1 = require("./acl");
const functions_1 = require("./functions");
const routes_store_1 = require("./routes-store");
const mongoParser = __importStar(require("mongo-parse"));
class Route {
    constructor(routes, def) {
        this.routes = routes;
        this.action = def.method.toLowerCase() === "action";
        this.method = this.action ? "POST" : def.method;
        this.path = def.path;
        this.resourceString = def.resource;
        if (def.resource) {
            const [resource, link] = def.resource.split(":");
            this.resource = resource;
            this.link = link;
        }
        // convert express path to URI Template and remove trailing slash
        this.href = functions_1.pathToTemplate(this.path).replace(/\/$/, "");
        /* optional route options */
        this.query = def.options.query || {};
        this.queryParsed = def.options.query ? mongoParser.parse(def.options.query) : undefined;
        this.permission = def.options.permission;
        this.hideRoot = def.options.hideRoot;
        this.hideDocs = def.options.hideDocs;
        this.expand = def.options.expand || {};
        if (this.permission && !acl_1.RoutesACL.isPermission(this.permission))
            throw new Error("Permission " + this.permission + " is not defined.");
        if (!this.permission)
            console.log("Routes warning: No defined permission for route " + this.resourceString + " (" + this.getHref() + ")");
    }
    getHref() {
        return this.routes.getRootUrl() + this.href;
    }
    routesAccessMiddleware(req, res, next) {
        const result = acl_1.RoutesACL.canRoute(this, req);
        req.acl = result;
        if (result.allowed)
            next();
        else
            res.sendStatus(403);
        this.logAccess(result, this.permission, req);
    }
    routesReqMiddleware(req, res, next) {
        req.routes = {
            route: this,
            routes: this.routes,
            links: (docs, resource) => links_1.RoutesLinks.add(docs, resource, req),
            findRoute: routes_1.Routes.findRoute
        };
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
    logAccess(result, permission, req) {
        if (routes_store_1.routesStore.acl.logConsole) {
            let logEvent = {
                result: result,
                req: req,
                permission: permission
            };
            let logString = routes_store_1.routesStore.acl.logString(logEvent);
            if (result)
                console.log(logString);
            else
                console.error(logString);
        }
    }
}
exports.Route = Route;
//# sourceMappingURL=route.js.map