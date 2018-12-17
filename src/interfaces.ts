
import * as express from "express";

import { Route } from "./route";

export interface RoutesStore {
  routes:Route[];
  acl:ACLOptions;
  options:any;
}

export interface RouteOptions {
  hide?:boolean;
  hideRoot?:boolean;
  hideDocs?:boolean;
  query?:any;
  permission?:string;
  expand?:any;
}

export interface RouteDef {
  method:string;
  resource:string;

  path:string;

  options:RouteOptions;
}

type ACLPermissionFunction = (permission:string,req:any) => any;

export interface ACLOptions {
  permissions:{
    [permission:string]:{
      [role:string]:boolean|any|ACLPermissionFunction
    }
  };

  userRoles:(req:any) => string[];

  defaultRole?:string;

  logString?:(event) => string;
  logConsole?:boolean;

  authorized?:(req,res,next) => void;
  unauthorized?:(req,res,next) => void;
}