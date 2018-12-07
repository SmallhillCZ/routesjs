"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class RoutesGlobalOptions {
    get(key) {
        return routesStore.options[key];
    }
    set(keyOrObject, value) {
        if (typeof keyOrObject === "string") {
            routesStore.options[keyOrObject] = value;
        }
        else {
            Object.assign(routesStore.options, keyOrObject);
        }
    }
}
exports.RoutesGlobalOptions = RoutesGlobalOptions;
//# sourceMappingURL=global-options.js.map