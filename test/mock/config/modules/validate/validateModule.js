"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidateModule = exports.validate = void 0;
const tslib_1 = require("tslib");
const index_1 = require("../../../../../index");
const validate_1 = require("./src/validate");
const pipelineDecorators_1 = require("../../../../../lib/pipelines/decoreators/pipelineDecorators");
function validate(num) {
    return (0, pipelineDecorators_1.pipelineDecorator)(validate_1.ValidatePipeLine, { validateNum: num });
}
exports.validate = validate;
let ValidateModule = class ValidateModule extends index_1.Module {
    get exports() {
        return [validate_1.ValidatePipeLine];
    }
};
ValidateModule = tslib_1.__decorate([
    (0, index_1.module)({})
], ValidateModule);
exports.ValidateModule = ValidateModule;
//# sourceMappingURL=validateModule.js.map