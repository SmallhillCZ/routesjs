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
      guest: { status: "public" }
    }
  },
  userRoles: req => req.user ? req.user.roles || [] : [],
  defaultRole: "guest",
  logConsole: false
});


const route = routes.get("posts","/posts",{permission:"posts:permission"});

describe("RoutesACL can", () => {
  
  it("should let admin to permission posts:permission", () => {
    const req:any = { user: { roles: ["admin"] } };
    expect(RoutesACL.can("posts:permission",req)).to.deep.equal({ allowed: true, filters: [] });
  });
  
  it("should let editor to permission posts:permission", () => {
    const req:any = { user: { _id: "userId", roles: ["editor"] } };
    const result = RoutesACL.can("posts:permission",req);
    expect(result.allowed).to.equal(true);
    expect(result.filters).to.deep.include({ author: req.user._id });
  });
  
  it("should let guest to permission posts:permission", () => {
    const req:any = { };
    const result = RoutesACL.can("posts:permission",req);
    expect(result.allowed).to.equal(true);
    expect(result.filters).to.deep.include({ status:"public" });
  });
});

describe("RoutesACL canRoute", () => {
  
  it("should let admin to route /posts", () => {
    const req:any = { user: { roles: ["admin"] } };
    expect(RoutesACL.canRoute(route,req)).to.deep.equal({ allowed: true, filters: [] });
  });
  
  it("should let editor to route /posts with filter", () => {
    const req:any = { user: { _id: "userId", roles: ["editor"] } };
    const result = RoutesACL.canRoute(route,req);
    expect(result.allowed).to.equal(true);
    expect(result.filters).to.deep.include({ author: req.user._id });
  });
  
  it("should let guest to route /posts with filter", () => {
    const req:any = { };
    const result = RoutesACL.canRoute(route,req);
    expect(result.allowed).to.equal(true);
    expect(result.filters).to.deep.include({ status:"public" });
  });
});

describe("RoutesACL canDoc", () => {
  
  it("should let admin to any document", () => {
    const req:any = { user: { roles: ["admin"] } };
    const result = RoutesACL.canDoc("posts:permission",{author:"userId",status:"draft"},req);
    expect(result).to.equal(true);
  });
  
  it("should let editor to their document", () => {
    const req:any = { user: { _id: "userId", roles: ["editor"] } };
    const result = RoutesACL.canDoc("posts:permission",{author:"userId"},req);
    expect(result).to.equal(true);
  });
  
  it("should let guest to public document", () => {
    const req:any = { };
    const result = RoutesACL.canDoc("posts:permission",{status:"public"},req);
    expect(result).to.equal(true);
  });
  
    
  it("should NOT let editor to someone elses document in route", () => {
    const req:any = { user: { _id: "userId2", roles: ["editor"] } };
    const result = RoutesACL.canDoc("posts:permission",{author:"userId"},req);
    expect(result).to.equal(false);
  });
  
  it("should NOT let guest to draft document", () => {
    const req:any = { };
    const result = RoutesACL.canDoc("posts:permission",{status:"draft"},req);
    expect(result).to.equal(false);
  });
  
});

describe("RoutesACL canRouteDoc", () => {
  
  it("should let admin to any document in route", () => {
    const req:any = { user: { roles: ["admin"] } };
    const result = RoutesACL.canRouteDoc(route,{author:"userId",status:"draft"},req);
    expect(result).to.equal(true);
  });
  
  it("should let editor to their document in route", () => {
    const req:any = { user: { _id: "userId", roles: ["editor"] } };
    const result = RoutesACL.canRouteDoc(route,{author:"userId"},req);
    expect(result).to.equal(true);
  });
  
  it("should let guest to public document in route", () => {
    const req:any = { };
    const result = RoutesACL.canRouteDoc(route,{status:"public"},req);
    expect(result).to.equal(true);
  });
  
  it("should NOT let editor to someone elses document in route", () => {
    const req:any = { user: { _id: "userId2", roles: ["editor"] } };
    const result = RoutesACL.canRouteDoc(route,{author:"userId"},req);
    expect(result).to.equal(false);
  });
  
  it("should NOT let guest to draft document in route", () => {
    const req:any = { };
    const result = RoutesACL.canRouteDoc(route,{status:"draft"},req);
    expect(result).to.equal(false);
  });
  
});
