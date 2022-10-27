"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DelayProvider = void 0;
const tslib_1 = require("tslib");
const utils_1 = require("@appolo/utils");
const inject_1 = require("@appolo/inject");
let DelayProvider = class DelayProvider {
    async get() {
        let time = Date.now();
        await utils_1.Promises.delay(this.moduleOptions.delay);
        return { delay: this.moduleOptions.delay, time: Date.now() - time };
    }
};
tslib_1.__decorate([
    (0, inject_1.inject)(),
    tslib_1.__metadata("design:type", Object)
], DelayProvider.prototype, "moduleOptions", void 0);
DelayProvider = tslib_1.__decorate([
    (0, inject_1.define)(),
    (0, inject_1.singleton)(),
    (0, inject_1.factory)()
], DelayProvider);
exports.DelayProvider = DelayProvider;
//# sourceMappingURL=delayProvider.js.map