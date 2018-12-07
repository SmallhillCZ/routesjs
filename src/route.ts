
import { Routes } from "./routes";

export interface RouteOptions {
  hidden?:boolean
}

export interface RouteDef {
  method:string;
  resource:string;

  path:string;

  options:RouteOptions;
}

export class Route {

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
    this.href = this.href.replace(/\/$/,""); // remove trailing slash
    
    this.options = def.options || {};

  }
  
  routesMiddleware(req,res,next){
    req.routes = {
      route: this
    };
    next();
  }

  handle(handler){
    const method = this.method.toLowerCase();
    const path = this.path;
    const globalMiddleware = this.routes.options.middleware || [];
    
    const middleware = [this.routesMiddleware.bind(this), ...globalMiddleware, ...arguments];
    
    if(middleware.length) this.routes.router[method](path, ...middleware);
  }

}