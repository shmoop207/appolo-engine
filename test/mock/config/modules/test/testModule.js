"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestModule = void 0;
const tslib_1 = require("tslib");
const index_1 = require("../../../../../index");
const test_1 = require("./src/test");
let TestModule = class TestModule extends index_1.Module {
    get exports() {
        return [test_1.Test];
    }
};
TestModule = tslib_1.__decorate([
    (0, index_1.module)({})
], TestModule);
exports.TestModule = TestModule;
//# sourceMappingURL=testModule.js.map