"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const routes_store_1 = require("./routes-store");
function RoutesLinks(docs, resource, req) {
    const routes = routes_store_1.RoutesStore.routes.filter(route => route.resource === resource);
    if (routes_store_1.RoutesStore.options.asyncAccess) {
        return (function () {
            return __awaiter(this, void 0, void 0, function* () {
                if (Array.isArray(docs)) {
                    for (let doc of docs)
                        yield setLinksAsync(routes, doc, req);
                }
                else
                    yield setLinksAsync(routes, docs, req);
            });
        })();
    }
    else {
        if (Array.isArray(docs)) {
            for (let doc of docs)
                setLinksSync(routes, doc, req);
        }
        else
            setLinksSync(routes, docs, req);
        return;
    }
}
exports.RoutesLinks = RoutesLinks;
function setLinksSync(routes, doc, req) {
    const links = {
        self: { href: req.originalUrl }
    };
    for (let route of routes) {
        if (route.hideDocs)
            continue;
        if (route.query && !route.query.matches(doc, false))
            continue;
        if (route.access && !route.access(req))
            continue;
        const linkName = route.link || "self";
        links[linkName] = {
            href: route.href.replace(/\{([^\}]+)\}/g, (match, key) => doc[key] || match)
        };
    }
    if (!doc._links)
        doc._links = {};
    Object.assign(doc._links, links);
}
function setLinksAsync(routes, doc, req) {
    return __awaiter(this, void 0, void 0, function* () {
        const links = {
            self: { href: req.originalUrl }
        };
        for (let route of routes) {
            if (route.hideDocs)
                continue;
            if (route.query && !route.query.matches(this, false))
                continue;
            if (route.access && !(yield Promise.resolve(route.access(req))))
                continue;
            const linkName = route.link || "self";
            links[linkName] = {
                href: route.href.replace(/\{([^\}]+)\}/g, (match, key) => doc[key] || match)
            };
        }
        if (!doc._links)
            doc._links = {};
        Object.assign(doc._links, links);
    });
}
//# sourceMappingURL=links.js.map