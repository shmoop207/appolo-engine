"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DbFactory = void 0;
const tslib_1 = require("tslib");
const utils_1 = require("@appolo/utils");
const test_1 = require("../../test/src/test");
const inject_1 = require("@appolo/inject");
let DbFactory = class DbFactory {
    async get() {
        await utils_1.Promises.delay(1);
        return { conn: "working", env: this.env2.type, name: this.test.name, time: Date.now() };
    }
};
tslib_1.__decorate([
    (0, inject_1.inject)(),
    tslib_1.__metadata("design:type", Object)
], DbFactory.prototype, "moduleOptions", void 0);
tslib_1.__decorate([
    (0, inject_1.inject)(),
    tslib_1.__metadata("design:type", Object)
], DbFactory.prototype, "env2", void 0);
tslib_1.__decorate([
    (0, inject_1.inject)(),
    tslib_1.__metadata("design:type", test_1.Test)
], DbFactory.prototype, "test", void 0);
DbFactory = tslib_1.__decorate([
    (0, inject_1.define)(),
    (0, inject_1.singleton)(),
    (0, inject_1.factory)()
], DbFactory);
exports.DbFactory = DbFactory;
//# sourceMappingURL=dbFactory.js.map