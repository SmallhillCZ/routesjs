import { Route } from "./route";
import { RoutesOptions } from "./routes";

export interface RoutesStore {
  routes:Route[];
  options:RoutesOptions;
}