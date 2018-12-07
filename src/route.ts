
import { Routes } from "./routes";
import { RoutesLinks } from "./links";
import { RoutesStore } from "./routes-store";

import * as express from "express";

import * as mongoParser from "mongo-parse";

export interface RouteOptions {
  hideRoot?:boolean;
  hideDocs?:boolean;
  query?:any;
  access?:(req:express.Request) => any|Promise<any>;
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
  link:string;
  
  href:string;
  
  /* optional route options */
  query:{ matches: (doc:any,validate:boolean) => boolean };
  access:any;
  hideRoot:boolean;
  hideDocs:boolean;

  constructor(private routes:Routes, def:RouteDef){

    this.method = def.method;
    this.path = def.path;
    
    const [,resource,link] = def.resource.match(/([^\:]+)\:?(.+)?/);
    this.resource = resource;
    this.link = link;
    
    this.href = this.routes.options.url + this.path.replace(/\:([^\/]+)/g,"{$1}");
    this.href = this.href.replace(/\/$/,""); // remove trailing slash
    
    /* optional route options */
    this.query = def.options.query ? mongoParser.parse(def.options.query) : undefined;
    this.access = def.options.access;
    this.hideRoot = def.options.hideRoot;
    this.hideDocs = def.options.hideDocs;
    
  }
  
  routesAccessMiddleware(req,res,next){
    
    if(!this.access) return this.accessContinue(req,res,next);
    
    if(RoutesStore.options.asyncAccess){
      this.access(req).then(result => !!result ? this.accessContinue(req,res,next) : this.accessError(req,res,next)).catch(this.accessError(req,res,next));
    }
    else{
      if(!!this.access(req)) this.accessContinue(req,res,next);
      else this.accessError(req,res,next);
    }
  }
  
  accessError(req,res,next) {
    res.sendStatus(401);
  }
  
  accessContinue(req,res,next){
    next();
  }
  
  routesReqMiddleware(req,res,next){
    req.routes = {
      route: this,
      routes: this.routes
    };
    req.links = (docs,resource) => RoutesLinks(docs,resource,req);
    next();
  }
  
  handle(handler){
    const method = this.method.toLowerCase();
    const path = this.path;
    
    const middleware = [
      this.routesReqMiddleware.bind(this),
      this.routesAccessMiddleware.bind(this),
      ...arguments
    ];
    
    if(middleware.length) this.routes.router[method](path, ...middleware);
  }

}