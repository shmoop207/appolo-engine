"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Test = void 0;
const tslib_1 = require("tslib");
const inject_1 = require("@appolo/inject");
let Test = class Test {
    initialize() {
        this.rootEnv.testModule = "testModule";
    }
    get name() {
        return "working";
    }
};
tslib_1.__decorate([
    inject_1.inject(),
    tslib_1.__metadata("design:type", Object)
], Test.prototype, "rootEnv", void 0);
tslib_1.__decorate([
    inject_1.init(),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", void 0)
], Test.prototype, "initialize", null);
Test = tslib_1.__decorate([
    inject_1.define(),
    inject_1.singleton()
], Test);
exports.Test = Test;
//# sourceMappingURL=test.js.map