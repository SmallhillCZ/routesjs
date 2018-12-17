import * as express from "express";
import { RouteOptions, ACLOptions } from "./interfaces";
import { Route } from "./route";
export interface RoutesOptions {
    url?: string;
    routerOptions?: express.RouterOptions;
}
export declare class Routes {
    instanceOptions?: RoutesOptions;
    parent: Routes;
    routes: Route[];
    router: any;
    options: RoutesOptions;
    rootUrl: string;
    constructor(instanceOptions?: RoutesOptions);
    get(resource: string, path: string, options: RouteOptions): Route;
    post(resource: string, path: string, options: RouteOptions): Route;
    put(resource: string, path: string, options: RouteOptions): Route;
    patch(resource: string, path: string, options: RouteOptions): Route;
    delete(resource: string, path: string, options: RouteOptions): Route;
    action(resource: string, path: string, options: RouteOptions): Route;
    createRoute(method: string, resource: string, path: string, options: RouteOptions): Route;
    child(path: string, childRoutes: Routes): void;
    getRootUrl(): any;
    static findRoute(resource: string, link: string, method: string): Route;
    static setACL(acl: ACLOptions): void;
    static setOptions(options: any): void;
}
