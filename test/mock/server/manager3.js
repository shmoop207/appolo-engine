"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const index_1 = require("../../../index");
let Manager3 = class Manager3 extends index_1.EventDispatcher {
    constructor() {
        super();
    }
    run() {
    }
};
tslib_1.__decorate([
    index_1.inject()
], Manager3.prototype, "manager", void 0);
Manager3 = tslib_1.__decorate([
    index_1.define(),
    index_1.singleton()
], Manager3);
exports.default = Manager3;
//# sourceMappingURL=manager3.js.map