"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DbManager = void 0;
const tslib_1 = require("tslib");
const test_1 = require("../../test/src/test");
const dbFactory_1 = require("./dbFactory");
const inject_1 = require("@appolo/inject");
let DbManager = class DbManager {
    constructor() {
        this.isFoundExportedFile = false;
        this.onInitCalled = false;
    }
    get db() {
        return this.dbFactory;
    }
};
tslib_1.__decorate([
    (0, inject_1.inject)(),
    tslib_1.__metadata("design:type", dbFactory_1.DbFactory)
], DbManager.prototype, "dbFactory", void 0);
tslib_1.__decorate([
    (0, inject_1.inject)(),
    tslib_1.__metadata("design:type", Object)
], DbManager.prototype, "env2", void 0);
tslib_1.__decorate([
    (0, inject_1.inject)(),
    tslib_1.__metadata("design:type", test_1.Test)
], DbManager.prototype, "test", void 0);
DbManager = tslib_1.__decorate([
    (0, inject_1.define)(),
    (0, inject_1.singleton)()
], DbManager);
exports.DbManager = DbManager;
//# sourceMappingURL=dbManager.js.map