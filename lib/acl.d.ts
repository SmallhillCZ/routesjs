import * as express from "express";
import { Route } from "./route";
export declare class RoutesACLUnauthorizedError extends Error {
    name: "RoutesACLUnauthorizedError";
    constructor(message: any);
}
export interface RoutesACLResult {
    allowed: boolean;
    filters?: any[];
}
export declare class RoutesACL {
    static can(permissionName: string, req: express.Request, params?: any): RoutesACLResult;
    static canRoute(route: Route, req: express.Request): RoutesACLResult;
    static canDoc(permission: string, doc: any, req: express.Request): boolean;
    static canRouteDoc(route: Route, doc: any, req: express.Request): boolean;
    static guard(permission: string, params?: any): express.RequestHandler;
    static isPermission(permission: string): boolean;
}
