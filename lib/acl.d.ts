import * as express from "express";
import { Route } from "./route";
export declare class RoutesACLUnauthorizedError extends Error {
    name: "RoutesACLUnauthorizedError";
    constructor(message: any);
}
export declare class RoutesACL {
    static can(permissionName: string, req: any, params?: any): boolean;
    static canRoute(route: Route, req: express.Request): boolean;
    static guard(permission: string, params?: any): express.RequestHandler;
    static isPermission(permission: string): boolean;
}
