"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const acl_1 = require("../acl");
function filterByPermission(permission, req, throwError) {
    const aclResult = acl_1.RoutesACL.can(permission, req);
    if (!aclResult.allowed) {
        if (throwError)
            throw new Error("Unauthorized");
        else
            this.where({ nonexistentrouteswherevariable: 5 });
    }
    if (aclResult.filters.length)
        this.where({ $or: aclResult.filters });
    return this;
}
function RoutesPluginsMongoose(schema) {
    schema.query.filterByPermission = filterByPermission;
    // old alias
    schema.query.permission = filterByPermission;
}
exports.RoutesPluginsMongoose = RoutesPluginsMongoose;
;
//# sourceMappingURL=mongoose.js.map