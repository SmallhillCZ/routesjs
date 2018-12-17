"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const acl_1 = require("../acl");
function RoutesPluginsMongoose(schema) {
    schema.query.permission = function (permission, req, throwError) {
        const aclResult = acl_1.RoutesACL.can(permission, req);
        if (!aclResult.allowed) {
            if (throwError) {
                console.log("throw");
                throw new Error("Unauthorized");
            }
            else
                this.where({ nonexistentrouteswherevariable: 5 });
        }
        if (aclResult.filters.length)
            this.where({ $or: aclResult.filters });
        return this;
    };
}
exports.RoutesPluginsMongoose = RoutesPluginsMongoose;
;
//# sourceMappingURL=mongoose.js.map