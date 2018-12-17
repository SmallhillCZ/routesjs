import { expect } from 'chai';
import 'mocha';

import { Routes } from "../routes";

import { RoutesACL } from "../acl";

const routes = new Routes();

Routes.setACL({
  permissions: {
    "posts:permission": {
      admin: true,
      editor: req => ({ author: req.user._id }),
      guest: {status: "public" }
    }
  },
  userRoles: req => req.user ? req.user.roles || [] : [],
  defaultRole: "guest",
  logConsole: false
});


const route = routes.get("posts","/posts",{permission:"posts:permission"});


describe("RoutesACL", () => {
  
  it("should let admin to route /posts", () => {
    const req:any = { user: { roles: ["admin"] } };
    expect(RoutesACL.canRoute(route,req)).to.deep.equal({ allowed: true, filters: [] });
  });
  
  it("should let editor to route /posts with filter", () => {
    const req:any = { user: { _id: "userId", roles: ["editor"] } };
    expect(RoutesACL.canRoute(route,req)).to.deep.equal({ allowed: true, filters: [{ author: req.user._id },{ status:"public" }] });
  });
  
  it("should let guest to route /posts with filter", () => {
    const req:any = { };
    expect(RoutesACL.canRoute(route,req)).to.deep.equal({ allowed: true, filters: [{ status:"public" }] });
  });
  
});
