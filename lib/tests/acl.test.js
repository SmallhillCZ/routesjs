"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
require("mocha");
const routes_1 = require("../routes");
const acl_1 = require("../acl");
const routes = new routes_1.Routes();
routes_1.Routes.setACL({
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
const route = routes.get("posts", "/posts", { permission: "posts:permission" });
describe("RoutesACL can", () => {
    it("should let admin to permission posts:permission", () => {
        const req = { user: { roles: ["admin"] } };
        chai_1.expect(acl_1.RoutesACL.can("posts:permission", req)).to.deep.equal({ allowed: true, filters: [] });
    });
    it("should let editor to permission posts:permission", () => {
        const req = { user: { _id: "userId", roles: ["editor"] } };
        const result = acl_1.RoutesACL.can("posts:permission", req);
        chai_1.expect(result.allowed).to.equal(true);
        chai_1.expect(result.filters).to.deep.include({ author: req.user._id });
    });
    it("should let guest to permission posts:permission", () => {
        const req = {};
        const result = acl_1.RoutesACL.can("posts:permission", req);
        chai_1.expect(result.allowed).to.equal(true);
        chai_1.expect(result.filters).to.deep.include({ status: "public" });
    });
});
describe("RoutesACL canRoute", () => {
    it("should let admin to route /posts", () => {
        const req = { user: { roles: ["admin"] } };
        chai_1.expect(acl_1.RoutesACL.canRoute(route, req)).to.deep.equal({ allowed: true, filters: [] });
    });
    it("should let editor to route /posts with filter", () => {
        const req = { user: { _id: "userId", roles: ["editor"] } };
        const result = acl_1.RoutesACL.canRoute(route, req);
        chai_1.expect(result.allowed).to.equal(true);
        chai_1.expect(result.filters).to.deep.include({ author: req.user._id });
    });
    it("should let guest to route /posts with filter", () => {
        const req = {};
        const result = acl_1.RoutesACL.canRoute(route, req);
        chai_1.expect(result.allowed).to.equal(true);
        chai_1.expect(result.filters).to.deep.include({ status: "public" });
    });
});
describe("RoutesACL canDoc", () => {
    it("should let admin to any document", () => {
        const req = { user: { roles: ["admin"] } };
        const result = acl_1.RoutesACL.canDoc("posts:permission", { author: "userId", status: "draft" }, req);
        chai_1.expect(result).to.equal(true);
    });
    it("should let editor to their document", () => {
        const req = { user: { _id: "userId", roles: ["editor"] } };
        const result = acl_1.RoutesACL.canDoc("posts:permission", { author: "userId" }, req);
        chai_1.expect(result).to.equal(true);
    });
    it("should let guest to public document", () => {
        const req = {};
        const result = acl_1.RoutesACL.canDoc("posts:permission", { status: "public" }, req);
        chai_1.expect(result).to.equal(true);
    });
    it("should NOT let editor to someone elses document in route", () => {
        const req = { user: { _id: "userId2", roles: ["editor"] } };
        const result = acl_1.RoutesACL.canDoc("posts:permission", { author: "userId" }, req);
        chai_1.expect(result).to.equal(false);
    });
    it("should NOT let guest to draft document", () => {
        const req = {};
        const result = acl_1.RoutesACL.canDoc("posts:permission", { status: "draft" }, req);
        chai_1.expect(result).to.equal(false);
    });
});
describe("RoutesACL canRouteDoc", () => {
    it("should let admin to any document in route", () => {
        const req = { user: { roles: ["admin"] } };
        const result = acl_1.RoutesACL.canRouteDoc(route, { author: "userId", status: "draft" }, req);
        chai_1.expect(result).to.equal(true);
    });
    it("should let editor to their document in route", () => {
        const req = { user: { _id: "userId", roles: ["editor"] } };
        const result = acl_1.RoutesACL.canRouteDoc(route, { author: "userId" }, req);
        chai_1.expect(result).to.equal(true);
    });
    it("should let guest to public document in route", () => {
        const req = {};
        const result = acl_1.RoutesACL.canRouteDoc(route, { status: "public" }, req);
        chai_1.expect(result).to.equal(true);
    });
    it("should NOT let editor to someone elses document in route", () => {
        const req = { user: { _id: "userId2", roles: ["editor"] } };
        const result = acl_1.RoutesACL.canRouteDoc(route, { author: "userId" }, req);
        chai_1.expect(result).to.equal(false);
    });
    it("should NOT let guest to draft document in route", () => {
        const req = {};
        const result = acl_1.RoutesACL.canRouteDoc(route, { status: "draft" }, req);
        chai_1.expect(result).to.equal(false);
    });
});
//# sourceMappingURL=acl.test.js.map