"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function rootEndpoint(options) {
    return function (req, res, next) {
        const api = {
            _links: {
                self: options && options.url || "/"
            }
        };
        if (options && options.info)
            Object.assign(api, options.info);
        for (let route of routesStore.routes) {
            if (route.options.hidden)
                continue;
            if (!route.resource)
                continue;
            api._links[route.resource] = {
                href: route.href
            };
        }
        res.json(api);
    };
}
exports.rootEndpoint = rootEndpoint;
//# sourceMappingURL=root-endpoint.js.map