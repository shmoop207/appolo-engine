"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const index_1 = require("../../../../../../index");
const test_1 = require("../../test/src/test");
const dbFactory_1 = require("./dbFactory");
let DbManager = class DbManager {
    constructor() {
        this.isFoundExportedFile = false;
    }
    get db() {
        return this.dbFactory;
    }
};
tslib_1.__decorate([
    index_1.inject(),
    tslib_1.__metadata("design:type", dbFactory_1.DbFactory)
], DbManager.prototype, "dbFactory", void 0);
tslib_1.__decorate([
    index_1.inject(),
    tslib_1.__metadata("design:type", Object)
], DbManager.prototype, "env2", void 0);
tslib_1.__decorate([
    index_1.inject(),
    tslib_1.__metadata("design:type", test_1.Test)
], DbManager.prototype, "test", void 0);
DbManager = tslib_1.__decorate([
    index_1.define(),
    index_1.singleton()
], DbManager);
exports.DbManager = DbManager;
//# sourceMappingURL=dbManager.js.map