"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BeforeTest = void 0;
const tslib_1 = require("tslib");
const inject_1 = require("@appolo/inject");
let BeforeTest = class BeforeTest {
    run(num) {
        return num + 5;
    }
    runAfter(num) {
        return num + 5;
    }
};
BeforeTest = tslib_1.__decorate([
    (0, inject_1.define)()
], BeforeTest);
exports.BeforeTest = BeforeTest;
//# sourceMappingURL=beforeTest.js.map