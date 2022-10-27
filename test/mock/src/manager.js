"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Manager = void 0;
const tslib_1 = require("tslib");
const pipelineTest_1 = require("./pipelineTest");
const pipelineDecorators_1 = require("../../../lib/pipelines/decoreators/pipelineDecorators");
const inject_1 = require("@appolo/inject");
const events_1 = require("@appolo/events");
const utils_1 = require("@appolo/utils");
let Manager = class Manager extends events_1.EventDispatcher {
    constructor() {
        super();
    }
    run() {
        this.working = true;
        return true;
    }
    testGuard(value1, value2) {
        return value1 + value2;
    }
    async testInterceptorTimeout(value1, value2) {
        await utils_1.Promises.delay(10);
        return value1 + value2;
    }
    async testInterceptorMultiValue(value1, value2) {
        return value1 + value2;
    }
    async testPipeMultiValue(value1, value2) {
        return value1 + value2;
    }
    async testCatchError(value1, value2) {
        throw new Error("some error");
    }
};
tslib_1.__decorate([
    (0, pipelineTest_1.guardSum)(5),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Number, Number]),
    tslib_1.__metadata("design:returntype", void 0)
], Manager.prototype, "testGuard", null);
tslib_1.__decorate([
    (0, pipelineTest_1.interceptorTimeout)(5),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Number, Number]),
    tslib_1.__metadata("design:returntype", Promise)
], Manager.prototype, "testInterceptorTimeout", null);
tslib_1.__decorate([
    (0, pipelineTest_1.interceptorMultiValue)(2),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Number, Number]),
    tslib_1.__metadata("design:returntype", Promise)
], Manager.prototype, "testInterceptorMultiValue", null);
tslib_1.__decorate([
    tslib_1.__param(0, (0, pipelineTest_1.pipeMultiValue)(2)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Number, Number]),
    tslib_1.__metadata("design:returntype", Promise)
], Manager.prototype, "testPipeMultiValue", null);
tslib_1.__decorate([
    (0, pipelineTest_1.catchError)(),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Number, Number]),
    tslib_1.__metadata("design:returntype", Promise)
], Manager.prototype, "testCatchError", null);
Manager = tslib_1.__decorate([
    (0, inject_1.define)(),
    (0, inject_1.singleton)(),
    (0, pipelineDecorators_1.pipelineInstance)(pipelineTest_1.PipelineTestOnCreate),
    tslib_1.__metadata("design:paramtypes", [])
], Manager);
exports.Manager = Manager;
//# sourceMappingURL=manager.js.map