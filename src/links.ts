import { routesStore } from "./routes-store";

import { Route } from "./route";
import { RoutesACL } from "./acl";

import { Resource } from "./specs/resource";
import { Links } from "./specs/links";
import { Actions } from "./specs/actions";

import * as express from "express";

export class RoutesLinks {

  static add(docs:Promise<any>,resource:string,req:express.Request):Promise<any>;
  static add(docs:Promise<any[]>,resource:string,req:express.Request):Promise<any[]>;
  static add(docs:any,resource:string,req:express.Request):any;
  static add(docs:any[],resource:string,req:express.Request):any[];
  static add(docs:any|any[]|Promise<any>|Promise<any[]>,resource:string,req:express.Request):any|any[]|Promise<any>|Promise<any[]>{

    const routes = routesStore.routes.filter(route => route.resource === resource)

    if(docs.then !== undefined){
      return docs.then(resolvedDocs => RoutesLinks.assignLinks(resolvedDocs,routes,req));
    }
    else return RoutesLinks.assignLinks(docs,routes,req);
  }

  static root(req){

    const links = {
      self: { href: "/" }
    };

    for ( let route of routesStore.routes ) {

      // actions are not included in root
      if(route.action) continue;
      
      // route shall not be included in root
      if(route.hideRoot) continue;

      // route is not assigned to a resource
      if(!route.resourceString) continue;

      const linkName = route.resourceString;
      const method = route.method.toUpperCase();
      
      var link:any = links[linkName];
      
      if(!link){
        
        const href = route.getHref();
        
        links[linkName] = link = {
          href: href,
          templated: href.match(/\{[^\}]+\}/) ? true : undefined,
          allowed: {}
        };
      }
      link.allowed[method] = !!RoutesACL.canRoute(route,req).allowed;
    }

    return links;
  }

  static assignLinks(docs:any|any[],routes:Route[],req:express.Request):Resource|Resource[]{

    const arrayDocs:any[] = Array.isArray(docs) ? docs : [docs];

    for(let doc of arrayDocs) {

      const self:any = { href: undefined, allowed: {} };
      const links:Links = { self };
      const actions:Actions = { };

      for(let route of routes){

        if(route.hideDocs) continue;

        if(route.queryParsed && !route.queryParsed.matches(doc,false)) continue;
        
        // check if ACL doc allowed
        const allowed = RoutesACL.canRouteDoc(route,doc,req);

        const linkName = route.link || "self";
        const method = route.method.toUpperCase();

        const href = route.getHref().replace(/\{([^\}]+)\}/g, (match,key) => doc[route.expand[key]] || doc[key] || match);
        
        if(route.action){
          actions[linkName] = {
            href: href,
            allowed: allowed
          };
        }
        else if(links[linkName]) {
          links[linkName].href = href;
          links[linkName].allowed[method] = allowed;
        }
        else {
          links[linkName] = {
            href: href,
            allowed: { [method]: allowed }
          };
        }
      }
      
      if(!doc._links) doc._links = {};
      if(!doc._actions) doc._actions = {};
      
      Object.assign(doc._links,links);
      Object.assign(doc._actions,actions);

    }

    return docs;
  }
}
