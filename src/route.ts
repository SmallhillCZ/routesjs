
import { RouteOptions, RouteDef } from "./interfaces";

import { Routes } from "./routes";
import { RoutesLinks } from "./links";
import { RoutesACL } from "./acl";

import { pathToTemplate } from "./functions";
import { routesStore } from "./routes-store";

import * as express from "express";

import * as mongoParser from "mongo-parse";

export class Route {

  action:boolean;
  
  method:string;
  path:string;

  resourceString:string;
  resource:string;
  link:string;

  href:string;

  /* optional route options */
  query:any;
  queryParsed:{ matches: (doc:any,validate:boolean) => boolean };
  permission:any;
  hideRoot:boolean;
  hideDocs:boolean;
  expand:any;

  constructor(private routes:Routes, def:RouteDef){

    this.action = def.method.toLowerCase() === "action";
    this.method = this.action ? "POST" : def.method;
    this.path = def.path;

    this.resourceString = def.resource;
    if(def.resource){
      const [resource,link] = def.resource.split(":");
      this.resource = resource;
      this.link = link;
    }

    // convert express path to URI Template and remove trailing slash
    this.href = pathToTemplate(this.path).replace(/\/$/,"");

    /* optional route options */
    this.query = def.options.query || {};
    this.queryParsed = def.options.query ? mongoParser.parse(def.options.query) : undefined;
    this.permission = def.options.permission;
    this.hideRoot = def.options.hideRoot;
    this.hideDocs = def.options.hideDocs;
    this.expand = def.options.expand || {};

    if(this.permission && !RoutesACL.isPermission(this.permission)) throw new Error("Permission " + this.permission + " is not defined.");
    if(!this.permission) console.log("Routes warning: No defined permission for route " + this.resourceString + "(" + this.href + ")");
  }
  
  getHref(){
    return this.routes.getRootUrl() + this.href;
  }

  routesAccessMiddleware(req,res,next){
    const result = RoutesACL.canRoute(this,req)
    
    req.acl = result;
    
    if(result.allowed) next();
    else res.sendStatus(401);
    
    this.logAccess(result,this.permission,req);
  }

  routesReqMiddleware(req,res,next){
    req.routes = {
      route: this,
      routes: this.routes,
      links: (docs,resource) => RoutesLinks.add(docs,resource,req),
      findRoute: Routes.findRoute
    };
    next();
  }

  handle(handler){
    const method = this.method.toLowerCase();
    const path = this.path;

    const middleware = [
      this.routesAccessMiddleware.bind(this),
      this.routesReqMiddleware.bind(this),
      ...arguments
    ];

    if(middleware.length) this.routes.router[method](path, ...middleware);
  }
  
  logAccess(result,permission,req){
    if(routesStore.acl.logConsole){

      let logEvent = {
        result: result,
        req: req,
        permission: permission
      };        
      let logString = routesStore.acl.logString(logEvent);

      if(result) console.log(logString);
      else console.error(logString);
    }
  }

}