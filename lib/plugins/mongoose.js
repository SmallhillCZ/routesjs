"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function routesMongoosePlugin(schema, options) {
    var defaultOptions = {
        cmpFn: (doc, resource) => doc.constructor.modelName.toLowerCase() === resource.split(":")[0],
        expFn: (doc, href) => href.replace(/\{id}/, doc._id)
    };
    options = Object.assign({}, defaultOptions, options);
    schema.virtual("_links").get(function () {
        const links = {};
        routesStore.routes
            .filter(route => options.cmpFn(this, route.resource))
            .forEach(route => {
            const match = route.resource.match(/^[^\:]+\:(.+)$/);
            const link = match ? match[1] : "self";
            links[link] = { href: options.expFn(this, route.href) };
        });
        return links;
    });
}
exports.routesMongoosePlugin = routesMongoosePlugin;
//# sourceMappingURL=mongoose.js.map