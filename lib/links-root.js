"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const routes_store_1 = require("./routes-store");
const acl_1 = require("./acl");
function RoutesLinksRoot(options) {
    return function (req, res, next) {
        const api = {
            _links: {
                self: options && options.url || req.originalUrl
            }
        };
        if (options && options.info)
            Object.assign(api, options.info);
        for (let route of routes_store_1.routesStore.routes) {
            if (route.hideRoot)
                continue;
            if (!route.resourceString)
                continue;
            if (!acl_1.RoutesACL.canRoute(route, req))
                continue;
            const link = route.resourceString;
            const href = route.getHref();
            api._links[link] = { href: href };
        }
        res.json(api);
    };
}
exports.RoutesLinksRoot = RoutesLinksRoot;
//# sourceMappingURL=links-root.js.map