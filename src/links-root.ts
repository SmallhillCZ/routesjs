import { routesStore } from "./routes-store";
import { RoutesACL } from "./acl";

export function RoutesLinksRoot(options){
  return function (req,res,next){

    const api = {
      _links: {
        self: options && options.url || req.originalUrl
      }
    };
    
    if(options && options.info) Object.assign(api,options.info);

    for ( let route of routesStore.routes ) {

      if(route.hideRoot) continue;
      
      if(!route.resourceString) continue;
      
      if(!RoutesACL.canRoute(route,req)) continue;

      const link = route.resourceString;
      const href = route.getHref();
      
      api._links[link] = { href: href };
    }

    res.json(api);
  }
}