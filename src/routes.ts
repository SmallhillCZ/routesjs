import * as express from "express";

import { Route, RouteDef, RouteOptions } from "./route";
import { RoutesStore } from "./routes-store";

declare var routesStore:RoutesStore;

export interface RoutesOptions {
  url:string;
  
  info?:any;
  middleware?:Array<(req,res,next) => void>;
  routerOptions?:express.RouterOptions;
}

export class Routes {

  routes:Route[] = [];

  router:express.Router;  

  constructor(public options:RoutesOptions){
    
    if(!options) throw new Error("You have to provide configuration");
    if(!options.url) throw new Error("You have to provide api root url");
    
    this.options = options;

    this.routes = routesStore.routes;
    
    this.router = express.Router(options.routerOptions);

    this.router.get("/",this.serveApiRoot.bind(this));
    
  }

  get(resource:string, path:string, options:RouteOptions) {
    return this.createRoute("get", resource, path, options);
  }

  post(resource:string, path:string, options:RouteOptions) {
    return this.createRoute("post", resource, path, options)
  }

  put(resource:string, path:string, options:RouteOptions) {
    return this.createRoute("put", resource, path, options)
  }

  patch(resource:string, path:string, options:RouteOptions) {
    return this.createRoute("patch", resource, path, options)
  }

  delete(resource:string, path:string, options:RouteOptions) {
    return this.createRoute("delete", resource, path, options)
  }

  createRoute(method:string, resource:string, path:string, options:RouteOptions){

    const routeDef = { method, resource, path, options }

    // save resource link
    const route = new Route(this, routeDef);

    this.routes.push(route);

    return route;

  }

  serveApiRoot(req,res,next){

    const api = {
      ...this.options.info,
      _links: {
        self: this.options.url
      }
    };

    for ( let route of this.routes ) {

      if(route.options.hidden) continue;

      api._links[route.resource] = {
        href: route.href
      };
    }

    res.json(api);
  };
}