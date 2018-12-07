import * as express from "express";

import { Route, RouteDef, RouteOptions } from "./route";
import { RoutesStore } from "./routes-store";

declare var routesStore:RoutesStore;

export interface RoutesOptions {
  url:string;
  
  info?:any;
  
  middleware?:Array<(req,res,next) => void>;
  
  routerOptions?:express.RouterOptions;
  
  rootEndpoint:boolean;
}

export class Routes {

  routes:Route[] = [];

  router:express.Router;  
  
  options:RoutesOptions;

  constructor(public instanceOptions:RoutesOptions){
    
    this.options = Object.assign({},routesStore.options,instanceOptions);
    
    if(!this.options) throw new Error("You have to provide configuration");
    if(!this.options.url) throw new Error("You have to provide api root url");
    
    this.routes = routesStore.routes;
    
    this.router = express.Router(this.options.routerOptions);
    
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

    if(!path) throw new Error("Missing path");
    
    const routeDef = { method, resource, path, options }

    // save resource link
    const route = new Route(this, routeDef);

    this.routes.push(route);

    return route;

  }
  
}