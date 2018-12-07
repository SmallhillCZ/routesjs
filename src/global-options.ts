import { RoutesStore } from "./routes-store";

declare var routesStore:RoutesStore;

export class RoutesGlobalOptions {
  get(key:string):any{
    return routesStore.options[key];
  }
  
  set(keyOrObject:string|any, value?:any):void{
    if(typeof keyOrObject === "string"){
      routesStore.options[keyOrObject] = value;
    }
    else{
      Object.assign(routesStore.options,keyOrObject);
    }
  }
}