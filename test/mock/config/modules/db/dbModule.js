"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DbModule = void 0;
const tslib_1 = require("tslib");
const index_1 = require("../../../../../index");
const dbFactory_1 = require("./src/dbFactory");
const dbManager_1 = require("./src/dbManager");
const nestedProvider_1 = require("../nested/src/nestedProvider");
const inject_1 = require("@appolo/inject");
let DbModule = class DbModule extends index_1.Module {
    static for(options) {
        return super.for(options);
    }
    get exports() {
        return [{ id: this.moduleOptions.id, type: dbFactory_1.DbFactory }, {
                id: this.moduleOptions.id + "DbManager",
                type: dbManager_1.DbManager
            }];
    }
    get imports() {
        return [{ id: "env", type: 'env2' }];
    }
    afterAppInitialize() {
    }
    async onInjectInitialize() {
        this.dbManager.onInitCalled = true;
    }
    async afterAppLaunch() {
        let isFound = this.app.tree.parent.discovery.findByType(nestedProvider_1.NestedProvider);
        this.dbManager.isFoundExportedFile = !!isFound && !!this.dbManager.db;
    }
};
tslib_1.__decorate([
    (0, inject_1.lazy)(),
    tslib_1.__metadata("design:type", dbManager_1.DbManager)
], DbModule.prototype, "dbManager", void 0);
DbModule = tslib_1.__decorate([
    (0, index_1.module)()
], DbModule);
exports.DbModule = DbModule;
//# sourceMappingURL=dbModule.js.map