import * as express from "express";
import * as mongoParser from "mongo-parse";

import { Route } from "./route";
import { routesStore } from "./routes-store";

export class RoutesACLUnauthorizedError extends Error{
  name: "RoutesACLUnauthorizedError";
  
  constructor(message){
    super(message);
  }
}

export interface RoutesACLResult {
  allowed:boolean;
  filters?:any[];
}

export class RoutesACL {
  
  // function to get user roles and evaluate permissions
  static can(permissionName:string,req:express.Request,params?:any):RoutesACLResult{

    if(!req) throw new Error("The req parameter is missing for can(permission,req,params?).")

    // get user roles
    const userRoles = routesStore.acl.userRoles(req).slice(0);
    if(routesStore.acl.defaultRole) userRoles.push(routesStore.acl.defaultRole);

    // default is no permission
    const permission = routesStore.acl.permissions[permissionName];

    // go through all roles and check if some has permission
    const result = { allowed: false, filters: [] };
    
    userRoles.some(roleName => {

      const rolePermission = permission[roleName];

      // not set or falsy does not allow
      if(!rolePermission) return false;

      // actual value allows if resolves to true-ish value
      const roleResult = (typeof rolePermission === 'function' ? rolePermission(req,params) : rolePermission);
      
      // true-ish results passes, object result means filter
      if(roleResult) {
        result.allowed = true;
        if(typeof roleResult === "object") result.filters.push(roleResult);        
      }
      
      // if result was general allowance nothing can be better, we dont have ot go through rest
      if(roleResult === true){
        result.filters = [];
        return true;
      }

    });
    
    return result;

  }
  
  // check if issuer of current request is allowed to access a certain route
  static canRoute(route:Route,req:express.Request):RoutesACLResult{
    
    // route that is not guarded by permission is allowed
    if(!route.permission) return { allowed: true, filters: [] };
      
    // route with permission is allowed/denied by ACL table 
    return RoutesACL.can(route.permission,req);
  }
  
  static canDoc(permission:string,doc:any,req:express.Request):boolean{
    const aclResult = RoutesACL.can(permission,req);
    const filtersAllowed = aclResult.filters.length ? aclResult.filters.some(filter => mongoParser.parse(filter).matches(doc,false)) : true;
    return aclResult.allowed && filtersAllowed;
  }
  
  static canRouteDoc(route:Route,doc:any,req:express.Request):boolean{
    return route.permission ? RoutesACL.canDoc(route.permission,doc,req) : true;
  }
  
  static guard(permission:string,params?:any):express.RequestHandler{

    if(!routesStore.acl.permissions[permission]) throw new Error(`Permission ${permission} not defined.`);

    // return middleware function for ExpressJS
    return function(req,res,next){

      // if function to evaluate req to params provided, then use it
      if(typeof params === "function") params = params(req);

      // evaluate permission
      var result = RoutesACL.can(permission,req,params);

      // if permission granted, send execution to the next middleware/route
      if(!result.allowed) next(new RoutesACLUnauthorizedError("Permission " + permission + " not granted."));

      // if permission not granted, then end request with 401 Unauthorized
      else next();

      this.logAccess(result,permission,params,req);
    }

  }
  
  static isPermission(permission:string){
    return !!routesStore.acl.permissions[permission];
  }

}