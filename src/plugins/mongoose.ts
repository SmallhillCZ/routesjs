import { RoutesACL } from "../acl";

import * as express from "express";

function filterByPermission(permission: string, req: express.Request, throwError?: boolean) {

  const aclResult = RoutesACL.can(permission, req);

  if (!aclResult.allowed) {
    if (throwError) throw new Error("Unauthorized");
    else this.where({ nonexistentrouteswherevariable: 5 });
  }
  if (aclResult.filters.length) this.where({ $or: aclResult.filters });

  return this;

}

export function RoutesPluginsMongoose(schema) {

  schema.query.filterByPermission = filterByPermission;

  // old alias
  schema.query.permission = filterByPermission;

};