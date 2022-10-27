"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const inject_1 = require("@appolo/inject");
const events_1 = require("@appolo/events");
const pipelineTest_1 = require("../pipelineTest");
let Manager4 = class Manager4 extends events_1.EventDispatcher {
    constructor() {
        super();
    }
    run(value) {
        return value;
    }
    run2(value) {
        return value;
    }
    _run3(value) {
        return value;
    }
};
Manager4 = tslib_1.__decorate([
    (0, inject_1.define)(),
    (0, inject_1.singleton)(),
    (0, pipelineTest_1.pipeMultiValue)(2),
    tslib_1.__metadata("design:paramtypes", [])
], Manager4);
exports.default = Manager4;
//# sourceMappingURL=manager4.js.map