import * as express from "express";

declare var routesStore;

export interface RoutesOptions {
  url:string;
  
  info?:any;
  middleware?:Array<(req,res,next) => void>;
  routerOptions?:express.RouterOptions;
}

export interface RouteOptions {
  query?:any;
  hidden?:boolean
}

export interface RouteDef {
  method:string;
  resource:string;

  path:string;

  options:RouteOptions;
}

export class Routes {

  routes:RoutesRoute[] = [];

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
    const route = new RoutesRoute(this, routeDef);

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

class RoutesRoute {

  method:string;
  path:string;
  
  resource:string;
  
  href:string;

  options:RouteOptions;

  constructor(private routes:Routes, def:RouteDef){

    this.method = def.method;
    this.path = def.path;
    
    this.resource = def.resource;
    
    this.href = this.routes.options.url + this.path.replace(/\/\:([^\/]+)(\/|$)/,"\/{$1}$2");
    
    this.options = def.options || {};

  }

  handle(handler){
    const method = this.method.toLowerCase();
    const path = this.path;
    const defaultMiddleware = this.routes.options.middleware || [];
    const middleware = [ ...defaultMiddleware, ...arguments ];
    
    if(middleware.length) this.routes.router[method](path, ...middleware);
  }

}