import * as express from "express";
import { Route, RouteOptions } from "./route";
export interface RoutesOptions {
    url: string;
    info?: any;
    middleware?: Array<(req: any, res: any, next: any) => void>;
    routerOptions?: express.RouterOptions;
}
export declare class Routes {
    options: RoutesOptions;
    routes: Route[];
    router: express.Router;
    constructor(options: RoutesOptions);
    get(resource: string, path: string, options: RouteOptions): Route;
    post(resource: string, path: string, options: RouteOptions): Route;
    put(resource: string, path: string, options: RouteOptions): Route;
    patch(resource: string, path: string, options: RouteOptions): Route;
    delete(resource: string, path: string, options: RouteOptions): Route;
    createRoute(method: string, resource: string, path: string, options: RouteOptions): Route;
    serveApiRoot(req: any, res: any, next: any): void;
}
