"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pipe = void 0;
const pipelineDecorators_1 = require("../../decoreators/pipelineDecorators");
const pipePipeline_1 = require("../pipeline/pipePipeline");
function pipe(pipe, metaData, options) {
    return (0, pipelineDecorators_1.pipelineDecorator)(pipePipeline_1.pipePipeline, { pipe, metaData }, options);
}
exports.pipe = pipe;
//# sourceMappingURL=pipeDecorator.js.map