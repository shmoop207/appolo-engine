"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.exception = void 0;
const pipelineDecorators_1 = require("../../decoreators/pipelineDecorators");
const exceptionPipeline_1 = require("../pipeline/exceptionPipeline");
function exception(exception, metaData, options) {
    return (0, pipelineDecorators_1.pipelineDecorator)(exceptionPipeline_1.exceptionPipeline, { exception, metaData }, options);
}
exports.exception = exception;
//# sourceMappingURL=exceptionDecorator.js.map