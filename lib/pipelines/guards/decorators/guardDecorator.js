"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.guard = void 0;
const guardPipeline_1 = require("../pipeline/guardPipeline");
const pipelineDecorators_1 = require("../../decoreators/pipelineDecorators");
function guard(guard, metaData, options) {
    return (0, pipelineDecorators_1.pipelineDecorator)(guardPipeline_1.guardPipeline, { guard, metaData }, options);
}
exports.guard = guard;
//# sourceMappingURL=guardDecorator.js.map