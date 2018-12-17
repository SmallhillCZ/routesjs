import { RouteDef } from "./interfaces";
import { Routes } from "./routes";
export declare class Route {
    private routes;
    action: boolean;
    method: string;
    path: string;
    resourceString: string;
    resource: string;
    link: string;
    href: string;
    query: any;
    queryParsed: {
        matches: (doc: any, validate: boolean) => boolean;
    };
    permission: any;
    hideRoot: boolean;
    hideDocs: boolean;
    expand: any;
    constructor(routes: Routes, def: RouteDef);
    getHref(): string;
    routesAccessMiddleware(req: any, res: any, next: any): void;
    routesReqMiddleware(req: any, res: any, next: any): void;
    handle(handler: any): void;
    logAccess(result: any, permission: any, req: any): void;
}
