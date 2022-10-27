"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const manager_1 = require("../manager");
const inject_1 = require("@appolo/inject");
const events_1 = require("@appolo/events");
let Manager3 = class Manager3 extends events_1.EventDispatcher {
    constructor() {
        super();
    }
    run() {
    }
};
tslib_1.__decorate([
    (0, inject_1.inject)(),
    tslib_1.__metadata("design:type", manager_1.Manager)
], Manager3.prototype, "manager", void 0);
Manager3 = tslib_1.__decorate([
    (0, inject_1.define)(),
    (0, inject_1.singleton)(),
    tslib_1.__metadata("design:paramtypes", [])
], Manager3);
exports.default = Manager3;
//# sourceMappingURL=manager3.js.map