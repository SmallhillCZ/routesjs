import { Route } from "./route";
import { RoutesStore } from "./interfaces";
import * as express from "express";

export const routesStore:RoutesStore = {
  routes: [],
  acl: {
    permissions: {},
    userRoles: (req:express.Request) => [],
    authenticated: (req:express.Request) => false
  },
  options: {},
}