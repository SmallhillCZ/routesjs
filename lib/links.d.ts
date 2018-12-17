import { Route } from "./route";
import { Resource } from "./specs/resource";
import * as express from "express";
export declare class RoutesLinks {
    static add(docs: Promise<any>, resource: string, req: express.Request): Promise<any>;
    static add(docs: Promise<any[]>, resource: string, req: express.Request): Promise<any[]>;
    static add(docs: any, resource: string, req: express.Request): any;
    static add(docs: any[], resource: string, req: express.Request): any[];
    static root(req: any): {
        self: {
            href: string;
        };
    };
    static assignLinks(docs: any | any[], routes: Route[], req: express.Request): Resource | Resource[];
}
