
import { Route } from "./route";

import { RoutesStore } from "./routes-store";

const globalAny:any = global;

globalAny.routesStore = {
  routes: [] 
};

export { Routes } from "./routes";

export { Route, RouteOptions } from "./route";