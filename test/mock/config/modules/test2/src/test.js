"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Test2 = void 0;
const tslib_1 = require("tslib");
const inject_1 = require("@appolo/inject");
let Test2 = class Test2 {
    get name() {
        return "working";
    }
};
Test2 = tslib_1.__decorate([
    (0, inject_1.define)(),
    (0, inject_1.singleton)()
], Test2);
exports.Test2 = Test2;
//# sourceMappingURL=test.js.map