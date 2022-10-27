"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DelayManager = void 0;
const tslib_1 = require("tslib");
const inject_1 = require("@appolo/inject");
let DelayManager = class DelayManager {
    get time() {
        return this.delayProvider.time;
    }
};
tslib_1.__decorate([
    (0, inject_1.inject)(),
    tslib_1.__metadata("design:type", Object)
], DelayManager.prototype, "env", void 0);
tslib_1.__decorate([
    (0, inject_1.inject)(),
    tslib_1.__metadata("design:type", Object)
], DelayManager.prototype, "delayProvider", void 0);
DelayManager = tslib_1.__decorate([
    (0, inject_1.define)(),
    (0, inject_1.singleton)()
], DelayManager);
exports.DelayManager = DelayManager;
//# sourceMappingURL=delayManager.js.map