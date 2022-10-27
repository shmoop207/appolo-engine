"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NestedProvider = void 0;
const tslib_1 = require("tslib");
const inject_1 = require("@appolo/inject");
let NestedProvider = class NestedProvider {
    async get() {
        //await Q.delay(this.moduleOptions.delay);
        return { dbMock2: this.dbMock2DbManager, delay: this.moduleOptions.delay, time: Date.now() };
    }
};
tslib_1.__decorate([
    (0, inject_1.inject)(),
    tslib_1.__metadata("design:type", Object)
], NestedProvider.prototype, "dbMock2DbManager", void 0);
tslib_1.__decorate([
    (0, inject_1.inject)(),
    tslib_1.__metadata("design:type", Object)
], NestedProvider.prototype, "moduleOptions", void 0);
NestedProvider = tslib_1.__decorate([
    (0, inject_1.define)(),
    (0, inject_1.singleton)(),
    (0, inject_1.factory)()
], NestedProvider);
exports.NestedProvider = NestedProvider;
//# sourceMappingURL=nestedProvider.js.map