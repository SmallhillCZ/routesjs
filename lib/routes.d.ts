import * as express from "express";
import { Route, RouteOptions } from "./route";
export interface RoutesOptions {
    url: string;
    routerOptions?: express.RouterOptions;
}
export declare class Routes {
    instanceOptions: RoutesOptions;
    routes: Route[];
    router: express.Router;
    options: RoutesOptions;
    rootUrl: string;
    constructor(instanceOptions: RoutesOptions);
    get(resource: string, path: string, options: RouteOptions): Route;
    post(resource: string, path: string, options: RouteOptions): Route;
    put(resource: string, path: string, options: RouteOptions): Route;
    patch(resource: string, path: string, options: RouteOptions): Route;
    delete(resource: string, path: string, options: RouteOptions): Route;
    createRoute(method: string, resource: string, path: string, options: RouteOptions): Route;
}
