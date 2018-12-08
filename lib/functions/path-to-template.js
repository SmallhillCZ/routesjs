"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function pathToTemplate(path) {
    return path.replace(/\:([^\/]+)/g, "{$1}");
}
exports.pathToTemplate = pathToTemplate;
//# sourceMappingURL=path-to-template.js.map