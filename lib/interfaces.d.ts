import * as express from "express";
import { Route } from "./route";
export interface RoutesStore {
    routes: Route[];
    acl: ACLOptions;
    options: any;
}
export interface RouteOptions {
    hide?: boolean;
    hideRoot?: boolean;
    hideDocs?: boolean;
    query?: any;
    permission?: string;
}
export interface RouteDef {
    method: string;
    resource: string;
    path: string;
    options: RouteOptions;
}
declare type ACLPermissionFunction = (permission: string, req: express.Request) => any;
export interface ACLOptions {
    permissions: {
        [permission: string]: {
            [role: string]: boolean | ACLPermissionFunction;
        };
    };
    userRoles: (req: express.Request) => string[];
    defaultRole?: string;
    logString?: (event: any) => string;
    logConsole?: boolean;
    authorized?: (req: any, res: any, next: any) => void;
    unauthorized?: (req: any, res: any, next: any) => void;
}
export {};
