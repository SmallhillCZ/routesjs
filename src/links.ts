import { Route } from "./route";
import { RoutesStore } from "./routes-store";
import { HalLinks } from "./specs/hal";

import * as express from "express";

export function RoutesLinks(docs:any|any[],resource:string,req:express.Request):void|Promise<void>{
  
  const routes = RoutesStore.routes.filter(route => route.resource === resource)

  if(RoutesStore.options.asyncAccess){
    return (async function(){
      if(Array.isArray(docs)){
        for(let doc of docs) await setLinksAsync(routes,doc,req);
      }
      else await setLinksAsync(routes,docs,req);
    })();
  }
  else {
    if(Array.isArray(docs)){
      for(let doc of docs) setLinksSync(routes,doc,req);
    }
    else setLinksSync(routes,docs,req);
    return;
  }
  
}
  
function setLinksSync(routes:Route[],doc:any,req:express.Request):void{
 
  const links:HalLinks = {
    self: { href: undefined }
  };
  
  for(let route of routes){
    
    if(route.hideDocs) continue;
    
    if(route.query && !route.query.matches(doc,false)) continue;
    
    if(route.access && !route.access(req)) continue;
    
    const linkName = route.link || "self";
    
    links[linkName] = {
      href: route.href.replace(/\{([^\}]+)\}/g, (match,key) => doc[key] || match)
    };
  }
  
  if(!doc._links) doc._links = {};
  Object.assign(doc._links,links);
}

async function setLinksAsync(routes:Route[],doc:any,req:express.Request):Promise<void>{
  
  const links:HalLinks = {
    self: { href: undefined }
  };

  for(let route of routes){
    
    if(route.hideDocs) continue;
    
    if(route.query && !route.query.matches(this,false)) continue;
    
    if(route.access && !await Promise.resolve(route.access(req))) continue;
    
    const linkName = route.link || "self";
    
    links[linkName] = {
      href: route.href.replace(/\{([^\}]+)\}/g, (match,key) => doc[key] || match)
    };
  }
  
  if(!doc._links) doc._links = {};
  Object.assign(doc._links,links);
}