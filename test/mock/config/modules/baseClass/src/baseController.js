"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseController = exports.Base2Controller = void 0;
const tslib_1 = require("tslib");
const index_1 = require("../../../../../../index");
const validateModule_1 = require("../../validate/validateModule");
class Base2Controller extends index_1.EventDispatcher {
    async validateBase(value, value2) {
        return value + value2;
    }
}
tslib_1.__decorate([
    tslib_1.__param(0, validateModule_1.validate(5)), tslib_1.__param(1, validateModule_1.validate(6)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Number, Number]),
    tslib_1.__metadata("design:returntype", Promise)
], Base2Controller.prototype, "validateBase", null);
exports.Base2Controller = Base2Controller;
class BaseController extends Base2Controller {
}
exports.BaseController = BaseController;
//# sourceMappingURL=baseController.js.map