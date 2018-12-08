import { routesStore } from "./routes-store";

import { Route } from "./route";
import { RoutesACL } from "./acl";

import { HalLinks } from "./specs/hal";

import * as express from "express";

export function RoutesLinks(docs:Promise<any|any[]>,resource:string,req:express.Request):Promise<any>;
export function RoutesLinks(docs:any|any[],resource:string,req:express.Request):void;
export function RoutesLinks(docs:any|any[]|Promise<any|any[]>,resource:string,req:express.Request):void|Promise<any>{

  const routes = routesStore.routes.filter(route => route.resource === resource)

  if(docs.then !== undefined){
    return docs.then(resolvedDocs => assignLinks(resolvedDocs,routes,req));
  }
  else assignLinks(docs,routes,req);
}

function assignLinks(docs:any|any[],routes:Route[],req:express.Request):void{

  const arrayDocs:any[] = Array.isArray(docs) ? docs : [docs];

  for(let doc of arrayDocs) {

    const links:HalLinks = {
      self: { href: undefined }
    };

    for(let route of routes){

      if(route.hideDocs) continue;

      if(route.query && !route.query.matches(doc,false)) continue;

      if(!RoutesACL.canRoute(route,req)) continue;

      const linkName = route.link || "self";
      const href = route.getHref();

      links[linkName] = {
        href: href.replace(/\{([^\}]+)\}/g, (match,key) => doc[key] || match)
      };
    }

    if(!doc._links) doc._links = {};
    Object.assign(doc._links,links);

  }
}