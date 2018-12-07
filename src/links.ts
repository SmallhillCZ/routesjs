import { Route } from "./route";
import { RoutesStore } from "./routes-store";
import { Links } from "./specs/hal";

import * as express from "express";

export function RoutesLinks(docs:any|any[],resource:string,req:express.Request):void|Promise<void>{
  
  const routes = RoutesStore.routes.filter(route => route.resource === resource)

  if(RoutesStore.options.asyncAccess){
    return (async function(){
      if(Array.isArray(docs)){
        for(let doc of docs){
          doc._links = await createLinksAsync(routes,doc,req);
        }
      }
      else docs._links = await createLinksAsync(routes,docs,req);
    })();
  }
  else {
    if(Array.isArray(docs)) docs.forEach(doc => doc._links = createLinksSync(routes,doc,req));
    else docs._links = createLinksSync(routes,docs,req);
    return;
  }
  
}
  
function createLinksSync(routes:Route[],doc:any,req:express.Request):Links{
  const links = {};
  for(let route of routes){
    
    if(route.hideDocs) continue;
    
    if(route.query && !route.query.matches(doc,false)) continue;
    
    if(route.access && !route.access(req)) continue;
    
    links[route.link || "self"] = {
      href: route.href.replace(/\{([^\}]+)\}/g, (match,key) => doc[key] || match)
    }
  }
  return links;
}

async function createLinksAsync(routes:Route[],doc:any,req:express.Request):Promise<Links>{
  const links = {};
  for(let route of routes){
    
    if(route.hideDocs) continue;
    
    if(route.query && !route.query.matches(this,false)) continue;
    
    if(route.access && !await Promise.resolve(route.access(req))) continue;
    
    links[route.link || "self"] = {
      href: route.href.replace(/\{([^\}]+)\}/g, (match,key) => doc[key] || match)
    }
  }
  return links;
}