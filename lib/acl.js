"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
        const userRoles = routes_store_1.routesStore.acl.userRoles(req);
        if (routes_store_1.routesStore.acl.defaultRole)
            userRoles.push(routes_store_1.routesStore.acl.defaultRole);
        // default is no permission
        const permission = routes_store_1.routesStore.acl.permissions[permissionName];
        // non existent permission does not allow
        if (!permission)
            return false;
        // go through all roles and check if some has permission
        return userRoles.some(roleName => {
            const rolePermission = permission[roleName];
            // not set or falsy does not allow
            if (!rolePermission)
                return false;
            // actual value allows if resolves to true-ish value
            return (typeof rolePermission === 'function' ? rolePermission(req, params) : rolePermission);
        });
    }
    // check if issuer of current request is allowed to access a certain route
    static canRoute(route, req) {
        // route that is not guarded by permission is allowed
        if (!route.permission)
            return true;
        // route with permission is allowed/denied by ACL table 
        return RoutesACL.can(route.permission, req);
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
            if (!result)
                next(new RoutesACLUnauthorizedError("Permission " + permission + " not granted."));
            // if permission not granted, then end request with 401 Unauthorized
            else
                next();
            if (routes_store_1.routesStore.acl.logConsole) {
                let logEvent = {
                    result: result,
                    req: req,
                    params: params,
                    permission: permission
                };
                let logString = routes_store_1.routesStore.acl.logString(logEvent);
                if (result)
                    console.log(logString);
                else
                    console.error(logString);
            }
        };
    }
    static isPermission(permission) {
        return !!routes_store_1.routesStore.acl.permissions[permission];
    }
}
exports.RoutesACL = RoutesACL;
//# sourceMappingURL=acl.js.map