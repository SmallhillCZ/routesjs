
import { RouteOptions, RouteDef } from "./interfaces";

import { Routes } from "./routes";
import { RoutesLinks } from "./links";
import { RoutesACL } from "./acl";

import { pathToTemplate } from "./functions";
import { routesStore } from "./routes-store";

import * as express from "express";

import * as mongoParser from "mongo-parse";

export class Route {

  method:string;
  path:string;

  resourceString:string;
  resource:string;
  link:string;

  href:string;

  /* optional route options */
  query:{ matches: (doc:any,validate:boolean) => boolean };
  permission:any;
  hideRoot:boolean;
  hideDocs:boolean;

  constructor(private routes:Routes, def:RouteDef){

    this.method = def.method;
    this.path = def.path;

    this.resourceString = def.resource;
    if(def.resource){
      const [,resource,link] = def.resource.match(/([^\:]+)\:?(.+)?/);
      this.resource = resource;
      this.link = link;
    }

    // convert express path to URI Template and remove trailing slash
    this.href = pathToTemplate(this.path).replace(/\/$/,"");

    /* optional route options */
    this.query = def.options.query ? mongoParser.parse(def.options.query) : undefined;
    this.permission = def.options.permission;
    this.hideRoot = def.options.hideRoot;
    this.hideDocs = def.options.hideDocs;

    if(this.permission && !RoutesACL.isPermission(this.permission)) throw new Error("Permission " + this.permission + " is not defined.");
    if(!this.permission) console.log("Routes warning: No defined permission for route " + this.href);
  }
  
  getHref(){
    return this.routes.rootUrl + this.href;
  }

  routesAccessMiddleware(req,res,next){
    if(!RoutesACL.canRoute(this,req)) return res.sendStatus(401);
    else return next();
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
      this.routesAccessMiddleware.bind(this),
      this.routesReqMiddleware.bind(this),
      ...arguments
    ];

    if(middleware.length) this.routes.router[method](path, ...middleware);
  }

}