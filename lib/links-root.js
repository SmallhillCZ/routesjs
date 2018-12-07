"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const routes_store_1 = require("./routes-store");
function RoutesLinksRoot(options) {
    return function (req, res, next) {
        const api = {
            _links: {
                self: options && options.url || "/"
            }
        };
        if (options && options.info)
            Object.assign(api, options.info);
        for (let route of routes_store_1.RoutesStore.routes) {
            console.log(route);
            if (route.hideRoot)
                continue;
            if (!route.resource)
                continue;
            const link = route.resource + (route.link ? ":" + route.link : "");
            api._links[link] = {
                href: route.href
            };
        }
        res.json(api);
    };
}
exports.RoutesLinksRoot = RoutesLinksRoot;
//# sourceMappingURL=links-root.js.map