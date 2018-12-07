
import { Route } from "./route";

import { RoutesStore } from "./routes-store";

const globalAny:any = global;

globalAny.routesStore = {
  routes: [],
  options: {}
};

export { Routes } from "./routes";

export { Route, RouteOptions } from "./route";

export { rootEndpoint } from "./root-endpoint";