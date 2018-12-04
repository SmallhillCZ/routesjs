import * as express from "express";
export interface RoutesOptions {
    url: string;
    info?: any;
    middleware?: Array<(req: any, res: any, next: any) => void>;
    routerOptions?: express.RouterOptions;
}
export interface RouteOptions {
    query?: any;
    hidden?: boolean;
}
export interface RouteDef {
    method: string;
    resource: string;
    path: string;
    options: RouteOptions;
}
export declare class Routes {
    options: RoutesOptions;
    routes: RoutesRoute[];
    router: express.Router;
    constructor(options: RoutesOptions);
    get(resource: string, path: string, options: RouteOptions): RoutesRoute;
    post(resource: string, path: string, options: RouteOptions): RoutesRoute;
    put(resource: string, path: string, options: RouteOptions): RoutesRoute;
    patch(resource: string, path: string, options: RouteOptions): RoutesRoute;
    delete(resource: string, path: string, options: RouteOptions): RoutesRoute;
    createRoute(method: string, resource: string, path: string, options: RouteOptions): RoutesRoute;
    serveApiRoot(req: any, res: any, next: any): void;
}
declare class RoutesRoute {
    private routes;
    method: string;
    path: string;
    resource: string;
    href: string;
    options: RouteOptions;
    constructor(routes: Routes, def: RouteDef);
    handle(handler: any): void;
}
export {};
