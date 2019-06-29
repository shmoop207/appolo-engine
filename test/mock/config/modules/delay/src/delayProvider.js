"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const Q = require("bluebird");
const index_1 = require("../../../../../../index");
let DelayProvider = class DelayProvider {
    async get() {
        let time = Date.now();
        await Q.delay(this.moduleOptions.delay);
        return { delay: this.moduleOptions.delay, time: Date.now() - time };
    }
};
tslib_1.__decorate([
    index_1.inject(),
    tslib_1.__metadata("design:type", Object)
], DelayProvider.prototype, "moduleOptions", void 0);
DelayProvider = tslib_1.__decorate([
    index_1.define(),
    index_1.singleton(),
    index_1.factory()
], DelayProvider);
exports.DelayProvider = DelayProvider;
//# sourceMappingURL=delayProvider.js.map