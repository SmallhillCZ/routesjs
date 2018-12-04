module.exports = function (req, res, next) {
    const resources = {};
    for (let route of routesStore.routes) {
        if (route.options.hidden)
            continue;
        const [resource, link = "self"] = route.resource.split(":");
        if (!resources[resource])
            resources[resource] = { _links: {} };
        resources[resource]._links[link] = {
            href: route.href
        };
    }
    res.json(resources);
};
//# sourceMappingURL=resources.js.map