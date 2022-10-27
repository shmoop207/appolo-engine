"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bootstrap = void 0;
const tslib_1 = require("tslib");
const index_1 = require("../../../index");
const manager_1 = require("./manager");
const delay_1 = require("../config/modules/delay/src/delay");
const dbManager_1 = require("../config/modules/db/src/dbManager");
const inject_1 = require("@appolo/inject");
let Bootstrap = class Bootstrap {
    async run() {
        this.working = true;
    }
};
tslib_1.__decorate([
    (0, inject_1.inject)(),
    tslib_1.__metadata("design:type", manager_1.Manager)
], Bootstrap.prototype, "manager", void 0);
tslib_1.__decorate([
    (0, inject_1.inject)(),
    tslib_1.__metadata("design:type", delay_1.Delay)
], Bootstrap.prototype, "delay", void 0);
tslib_1.__decorate([
    (0, inject_1.inject)(),
    tslib_1.__metadata("design:type", delay_1.Delay)
], Bootstrap.prototype, "delay2", void 0);
tslib_1.__decorate([
    (0, inject_1.inject)(),
    tslib_1.__metadata("design:type", Object)
], Bootstrap.prototype, "dbMock", void 0);
tslib_1.__decorate([
    (0, inject_1.inject)(),
    tslib_1.__metadata("design:type", dbManager_1.DbManager)
], Bootstrap.prototype, "dbManagerNested", void 0);
Bootstrap = tslib_1.__decorate([
    (0, inject_1.define)(),
    (0, inject_1.singleton)(),
    (0, index_1.bootstrap)()
], Bootstrap);
exports.Bootstrap = Bootstrap;
//# sourceMappingURL=bootstrap.js.map