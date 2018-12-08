import * as express from "express";
declare type RoutesACLFunction = (permission: string, req: express.Request) => any;
export interface IRoutesACLOptions {
    permissions: {
        [permission: string]: {
            [role: string]: boolean | RoutesACLFunction;
        };
    };
    userRoles: (req: any) => string[];
    defaultRole?: string;
    logString?: (event: any) => string;
    logConsole?: boolean;
    authorized?: (req: any, res: any, next: any) => void;
    unauthorized?: (req: any, res: any, next: any) => void;
}
export {};
