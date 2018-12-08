import { RouteDef } from "./interfaces";
import { Routes } from "./routes";
export declare class Route {
    private routes;
    method: string;
    path: string;
    resourceString: string;
    resource: string;
    link: string;
    href: string;
    query: {
        matches: (doc: any, validate: boolean) => boolean;
    };
    permission: any;
    hideRoot: boolean;
    hideDocs: boolean;
    constructor(routes: Routes, def: RouteDef);
    getHref(): string;
    routesAccessMiddleware(req: any, res: any, next: any): any;
    routesReqMiddleware(req: any, res: any, next: any): void;
    handle(handler: any): void;
}
