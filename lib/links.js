"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const routes_store_1 = require("./routes-store");
const acl_1 = require("./acl");
function RoutesLinks(docs, resource, req) {
    const routes = routes_store_1.routesStore.routes.filter(route => route.resource === resource);
    const arrayDocs = Array.isArray(docs) ? docs : [docs];
    for (let doc of docs) {
        const links = {
            self: { href: undefined }
        };
        for (let route of routes) {
            if (route.hideDocs)
                continue;
            if (route.query && !route.query.matches(doc, false))
                continue;
            if (!acl_1.RoutesACL.canRoute(route, req))
                continue;
            const linkName = route.link || "self";
            const href = route.getHref();
            links[linkName] = {
                href: href.replace(/\{([^\}]+)\}/g, (match, key) => doc[key] || match)
            };
        }
        if (!doc._links)
            doc._links = {};
        Object.assign(doc._links, links);
    }
}
exports.RoutesLinks = RoutesLinks;
//# sourceMappingURL=links.js.map