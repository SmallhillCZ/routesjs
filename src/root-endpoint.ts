import { RoutesStore } from "./routes-store";

declare var routesStore:RoutesStore;

export function rootEndpoint(options){
  return function (req,res,next){

    const api = {
      _links: {
        self: options && options.url || "/"
      }
    };
    
    if(options && options.info) Object.assign(api,options.info);

    for ( let route of routesStore.routes ) {

      if(route.options.hidden) continue;
      if(!route.resource) continue;

      api._links[route.resource] = {
        href: route.href
      };
    }

    res.json(api);
  }
}