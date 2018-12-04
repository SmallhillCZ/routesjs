import * as express from "express";
export interface RoutesOptions {
    root: string;
}
export interface RouteOptions {
    query?: any;
}
export declare class Routes {
    private options;
    routes: RoutesRoute[];
    router: express.Router;
    constructor(options: RoutesOptions);
    get(resource: string, path: string, options: RouteOptions): RoutesRoute;
    post(resource: string, path: string, options: RouteOptions): RoutesRoute;
    put(resource: string, path: string, options: RouteOptions): RoutesRoute;
    patch(resource: string, path: string, options: RouteOptions): RoutesRoute;
    delete(resource: string, path: string, options: RouteOptions): RoutesRoute;
    createRoute(method: string, resource: string, path: string, options: RouteOptions): RoutesRoute;
    serveRssources(req: any, res: any, next: any): void;
}
declare class RoutesRoute {
    private router;
    private method;
    private resource;
    private path;
    private href;
    private options;
    queryParsed: any;
    constructor(router: any, method: any, resource: any, path: any, href: any, options: any);
    handle(handler: any): void;
}
export {};
