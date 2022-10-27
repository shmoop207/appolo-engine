"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Controller = void 0;
const tslib_1 = require("tslib");
const index_1 = require("../../../index");
const manager_1 = require("./manager");
const beforeTest_1 = require("./beforeTest");
const pipelineTest_1 = require("./pipelineTest");
const validateModule_1 = require("../config/modules/validate/validateModule");
const baseController_1 = require("../config/modules/baseClass/src/baseController");
const inject_1 = require("@appolo/inject");
let Controller = class Controller extends baseController_1.BaseController {
    constructor() {
        super();
    }
    run() {
        this.working = true;
    }
    async testBefore(num) {
        return num + 1;
    }
    async testAfter(num) {
        return num + 1;
    }
    async pipelineTest(arr) {
        arr.push(1);
        return arr;
    }
    async pipelineTest2(arr) {
        arr.push(1);
        return arr;
    }
    async validateTest(value) {
        return value;
    }
    async validateTest2(value, value2) {
        return value + value2;
    }
};
tslib_1.__decorate([
    (0, inject_1.inject)(),
    tslib_1.__metadata("design:type", manager_1.Manager)
], Controller.prototype, "manager", void 0);
tslib_1.__decorate([
    (0, inject_1.inject)(),
    tslib_1.__metadata("design:type", Object)
], Controller.prototype, "logger2", void 0);
tslib_1.__decorate([
    (0, index_1.before)(beforeTest_1.BeforeTest, c => c.run),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Number]),
    tslib_1.__metadata("design:returntype", Promise)
], Controller.prototype, "testBefore", null);
tslib_1.__decorate([
    (0, index_1.after)(beforeTest_1.BeforeTest, c => c.runAfter),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Number]),
    tslib_1.__metadata("design:returntype", Promise)
], Controller.prototype, "testAfter", null);
tslib_1.__decorate([
    (0, index_1.pipeline)(pipelineTest_1.PipelineTest),
    (0, index_1.pipeline)(pipelineTest_1.PipelineTest2),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Array]),
    tslib_1.__metadata("design:returntype", Promise)
], Controller.prototype, "pipelineTest", null);
tslib_1.__decorate([
    tslib_1.__param(0, (0, index_1.pipeline)(pipelineTest_1.PipelineTest)),
    tslib_1.__param(0, (0, index_1.pipeline)(pipelineTest_1.PipelineTest2)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Array]),
    tslib_1.__metadata("design:returntype", Promise)
], Controller.prototype, "pipelineTest2", null);
tslib_1.__decorate([
    (0, validateModule_1.validate)(5),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Number]),
    tslib_1.__metadata("design:returntype", Promise)
], Controller.prototype, "validateTest", null);
tslib_1.__decorate([
    tslib_1.__param(0, (0, validateModule_1.validate)(5)),
    tslib_1.__param(1, (0, validateModule_1.validate)(6)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Number, Number]),
    tslib_1.__metadata("design:returntype", Promise)
], Controller.prototype, "validateTest2", null);
Controller = tslib_1.__decorate([
    (0, inject_1.define)(),
    tslib_1.__metadata("design:paramtypes", [])
], Controller);
exports.Controller = Controller;
//# sourceMappingURL=controller.js.map