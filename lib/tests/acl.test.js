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
describe("RoutesACL", () => {
    it("should let admin to route /posts", () => {
        const req = { user: { roles: ["admin"] } };
        chai_1.expect(acl_1.RoutesACL.canRoute(route, req)).to.deep.equal({ allowed: true, filters: [] });
    });
    it("should let editor to route /posts with filter", () => {
        const req = { user: { _id: "userId", roles: ["editor"] } };
        chai_1.expect(acl_1.RoutesACL.canRoute(route, req)).to.deep.equal({ allowed: true, filters: [{ author: req.user._id }, { status: "public" }] });
    });
    it("should let guest to route /posts with filter", () => {
        const req = {};
        chai_1.expect(acl_1.RoutesACL.canRoute(route, req)).to.deep.equal({ allowed: true, filters: [{ status: "public" }] });
    });
});
//# sourceMappingURL=acl.test.js.map