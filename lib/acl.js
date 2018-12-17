"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoParser = __importStar(require("mongo-parse"));
const routes_store_1 = require("./routes-store");
class RoutesACLUnauthorizedError extends Error {
    constructor(message) {
        super(message);
    }
}
exports.RoutesACLUnauthorizedError = RoutesACLUnauthorizedError;
class RoutesACL {
    // function to get user roles and evaluate permissions
    static can(permissionName, req, params) {
        if (!req)
            throw new Error("The req parameter is missing for can(permission,req,params?).");
        // get user roles
        const userRoles = routes_store_1.routesStore.acl.userRoles(req).slice(0);
        if (routes_store_1.routesStore.acl.defaultRole)
            userRoles.push(routes_store_1.routesStore.acl.defaultRole);
        // default is no permission
        const permission = routes_store_1.routesStore.acl.permissions[permissionName];
        // go through all roles and check if some has permission
        const result = { allowed: false, filters: [] };
        userRoles.some(roleName => {
            const rolePermission = permission[roleName];
            // not set or falsy does not allow
            if (!rolePermission)
                return false;
            // actual value allows if resolves to true-ish value
            const roleResult = (typeof rolePermission === 'function' ? rolePermission(req, params) : rolePermission);
            // true-ish results passes, object result means filter
            if (roleResult) {
                result.allowed = true;
                if (typeof roleResult === "object")
                    result.filters.push(roleResult);
            }
            // if result was general allowance nothing can be better, we dont have ot go through rest
            if (roleResult === true) {
                result.filters = [];
                return true;
            }
        });
        return result;
    }
    // check if issuer of current request is allowed to access a certain route
    static canRoute(route, req) {
        // route that is not guarded by permission is allowed
        if (!route.permission)
            return { allowed: true };
        // route with permission is allowed/denied by ACL table 
        return RoutesACL.can(route.permission, req);
    }
    static canDoc(permission, doc, req) {
        const aclResult = RoutesACL.can(permission, req);
        return aclResult.allowed && (!aclResult.filters.length || !aclResult.filters.some(filter => !mongoParser.parse(filter).matches(doc, false)));
    }
    static canRouteDoc(route, doc, req) {
        return route.permission ? RoutesACL.canDoc(route.permission, doc, req) : true;
    }
    static guard(permission, params) {
        if (!routes_store_1.routesStore.acl.permissions[permission])
            throw new Error(`Permission ${permission} not defined.`);
        // return middleware function for ExpressJS
        return function (req, res, next) {
            // if function to evaluate req to params provided, then use it
            if (typeof params === "function")
                params = params(req);
            // evaluate permission
            var result = RoutesACL.can(permission, req, params);
            // if permission granted, send execution to the next middleware/route
            if (!result.allowed)
                next(new RoutesACLUnauthorizedError("Permission " + permission + " not granted."));
            // if permission not granted, then end request with 401 Unauthorized
            else
                next();
            this.logAccess(result, permission, params, req);
        };
    }
    static isPermission(permission) {
        return !!routes_store_1.routesStore.acl.permissions[permission];
    }
}
exports.RoutesACL = RoutesACL;
//# sourceMappingURL=acl.js.map