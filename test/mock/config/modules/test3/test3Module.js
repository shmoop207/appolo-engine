"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Test3Module = void 0;
const tslib_1 = require("tslib");
const index_1 = require("../../../../../index");
const index_2 = require("@appolo/inject/index");
let Test3Module = class Test3Module extends index_1.Module {
    constructor() {
        super(...arguments);
        this.order = [];
    }
    beforeAppInitialize() {
        this.order.push("beforeAppInitialize");
    }
    beforeModuleInitialize() {
        this.order.push("beforeModuleInitialize");
    }
    beforeModuleLaunch() {
        this.order.push("beforeModuleLaunch");
    }
    onInjectInitialize() {
        this.order.push("onInjectInitialize");
    }
    onInjectBootstrap() {
        this.order.push("onInjectBootstrap");
    }
    afterModuleInitialize() {
        this.order.push("afterModuleInitialize");
    }
    afterAppInitialize() {
        this.order.push("afterAppInitialize");
    }
    afterModuleLaunch() {
        this.order.push("afterModuleLaunch");
    }
    afterAppLaunch() {
        this.order.push("afterAppLaunch");
    }
    beforeReset() {
        this.order.push("beforeReset");
    }
    reset() {
        this.order.push("reset");
    }
};
tslib_1.__decorate([
    (0, index_2.initAsync)(),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", void 0)
], Test3Module.prototype, "onInjectInitialize", null);
tslib_1.__decorate([
    (0, index_2.bootstrapAsync)(),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", void 0)
], Test3Module.prototype, "onInjectBootstrap", null);
Test3Module = tslib_1.__decorate([
    (0, index_1.module)()
], Test3Module);
exports.Test3Module = Test3Module;
//# sourceMappingURL=test3Module.js.map