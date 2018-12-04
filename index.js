global.routesStore = {
  routes: []
}

const router = require("./routes.router");

const resources = require("./routes.resources");

const plugins = {
  mongoose: require("./plugins/mongoose")
};

module.exports = { router, resources, plugins };
