"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const routes_store_1 = require("./routes-store");
const acl_1 = require("./acl");
class RoutesLinks {
    static add(docs, resource, req) {
        const routes = routes_store_1.routesStore.routes.filter(route => route.resource === resource);
        if (docs.then !== undefined) {
            return docs.then(resolvedDocs => RoutesLinks.assignLinks(resolvedDocs, routes, req));
        }
        else
            return RoutesLinks.assignLinks(docs, routes, req);
    }
    static root(req) {
        const links = {
            self: { href: "/" }
        };
        for (let route of routes_store_1.routesStore.routes) {
            // actions are not included in root
            if (route.action)
                continue;
            // route shall not be included in root
            if (route.hideRoot)
                continue;
            // route is not assigned to a resource
            if (!route.resourceString)
                continue;
            const linkName = route.resourceString;
            const method = route.method.toUpperCase();
            var link = links[linkName];
            if (!link) {
                const href = route.getHref();
                links[linkName] = link = {
                    href: href,
                    templated: href.match(/\{[^\}]+\}/) ? true : undefined,
                    allowed: {}
                };
            }
            link.allowed[method] = !!acl_1.RoutesACL.canRoute(route, req).allowed;
        }
        return links;
    }
    static assignLinks(docs, routes, req, options = {}) {
        const arrayDocs = Array.isArray(docs) ? docs : [docs];
        for (let doc of arrayDocs) {
            const self = { href: undefined, allowed: {} };
            const links = { self };
            const actions = {};
            const docData = options.noStringify ? doc : JSON.parse(JSON.stringify(doc));
            for (let route of routes) {
                if (route.hideDocs)
                    continue;
                if (route.queryParsed && !route.queryParsed.matches(docData, false))
                    continue;
                // check if ACL doc allowed
                const allowed = acl_1.RoutesACL.canRouteDoc(route, docData, req);
                const linkName = route.link || "self";
                const method = route.method.toUpperCase();
                const href = route.getHref().replace(/\{([^\}]+)\}/g, (match, key) => docData[route.expand[key]] || docData[key] || match);
                if (route.action) {
                    actions[linkName] = {
                        href: href,
                        allowed: allowed
                    };
                }
                else if (links[linkName]) {
                    links[linkName].href = href;
                    links[linkName].allowed[method] = allowed;
                }
                else {
                    links[linkName] = {
                        href: href,
                        allowed: { [method]: allowed }
                    };
                }
            }
            if (!doc._links)
                doc._links = {};
            if (!doc._actions)
                doc._actions = {};
            Object.assign(doc._links, links);
            Object.assign(doc._actions, actions);
        }
        return docs;
    }
}
exports.RoutesLinks = RoutesLinks;
//# sourceMappingURL=links.js.map