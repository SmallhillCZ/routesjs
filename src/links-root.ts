import { RoutesStore } from "./routes-store";

export function RoutesLinksRoot(options){
  return function (req,res,next){

    const api = {
      _links: {
        self: options && options.url || req.originalUrl
      }
    };
    
    if(options && options.info) Object.assign(api,options.info);

    for ( let route of RoutesStore.routes ) {

      if(route.hideRoot) continue;
      if(!route.resource) continue;

      const link = route.resource + (route.link ? ":" + route.link : "");
      
      api._links[link] = {
        href: route.href
      };
    }

    res.json(api);
  }
}