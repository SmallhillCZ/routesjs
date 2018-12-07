import { Routes } from "./routes";
import * as express from "express";
export interface RouteOptions {
    hideRoot?: boolean;
    hideDocs?: boolean;
    query?: any;
    access?: (req: express.Request) => any | Promise<any>;
}
export interface RouteDef {
    method: string;
    resource: string;
    path: string;
    options: RouteOptions;
}
export declare class Route {
    private routes;
    method: string;
    path: string;
    resource: string;
    link: string;
    href: string;
    query: {
        matches: (doc: any, validate: boolean) => boolean;
    };
    access: any;
    hideRoot: boolean;
    hideDocs: boolean;
    constructor(routes: Routes, def: RouteDef);
    routesAccessMiddleware(req: any, res: any, next: any): void;
    accessError(req: any, res: any, next: any): void;
    accessContinue(req: any, res: any, next: any): void;
    routesReqMiddleware(req: any, res: any, next: any): void;
    handle(handler: any): void;
}
