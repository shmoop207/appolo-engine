"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.catchError = exports.ExceptionPipeLine = exports.pipeMultiValue = exports.PipeMultiValue = exports.interceptorMultiValue = exports.InterceptorMultiValue = exports.interceptorTimeout = exports.InterceptorTimeout = exports.guardSum = exports.GuardTest = exports.PipelineTestOnCreate = exports.PipelineTest2 = exports.PipelineTest = void 0;
const tslib_1 = require("tslib");
const index_1 = require("../../../index");
const inject_1 = require("@appolo/inject");
const utils_1 = require("@appolo/utils");
let PipelineTest = class PipelineTest {
    async run(context, next) {
        context.getArgumentAt(0).push(2);
        return next();
    }
};
PipelineTest = tslib_1.__decorate([
    (0, inject_1.define)()
], PipelineTest);
exports.PipelineTest = PipelineTest;
let PipelineTest2 = class PipelineTest2 {
    async run(context, next) {
        context.getArgumentAt(0).push(3);
        return next();
    }
};
PipelineTest2 = tslib_1.__decorate([
    (0, inject_1.define)()
], PipelineTest2);
exports.PipelineTest2 = PipelineTest2;
let PipelineTestOnCreate = class PipelineTestOnCreate {
    async run(context, next) {
        context.instance["onCreateTest"] = true;
        return next();
    }
};
PipelineTestOnCreate = tslib_1.__decorate([
    (0, inject_1.define)()
], PipelineTestOnCreate);
exports.PipelineTestOnCreate = PipelineTestOnCreate;
let GuardTest = class GuardTest {
    isValid(context) {
        let sum = 0;
        context.values.forEach(item => sum = sum + item.value);
        return sum < context.metaData.max;
    }
};
GuardTest = tslib_1.__decorate([
    (0, inject_1.define)()
], GuardTest);
exports.GuardTest = GuardTest;
function guardSum(max) {
    return (0, index_1.guard)(GuardTest, { max });
}
exports.guardSum = guardSum;
let InterceptorTimeout = class InterceptorTimeout {
    intercept(context, next) {
        return utils_1.Promises.timeout(next(), context.metaData.timeout);
    }
};
InterceptorTimeout = tslib_1.__decorate([
    (0, inject_1.define)()
], InterceptorTimeout);
exports.InterceptorTimeout = InterceptorTimeout;
function interceptorTimeout(timeout) {
    return (0, index_1.intercept)(InterceptorTimeout, { timeout });
}
exports.interceptorTimeout = interceptorTimeout;
let InterceptorMultiValue = class InterceptorMultiValue {
    async intercept(context, next) {
        let result = await next();
        return result * context.metaData.multi;
    }
};
InterceptorMultiValue = tslib_1.__decorate([
    (0, inject_1.define)()
], InterceptorMultiValue);
exports.InterceptorMultiValue = InterceptorMultiValue;
function interceptorMultiValue(multi) {
    return (0, index_1.intercept)(InterceptorMultiValue, { multi });
}
exports.interceptorMultiValue = interceptorMultiValue;
let PipeMultiValue = class PipeMultiValue {
    async transform(value, context) {
        return value * context.metaData.multi;
    }
};
PipeMultiValue = tslib_1.__decorate([
    (0, inject_1.define)()
], PipeMultiValue);
exports.PipeMultiValue = PipeMultiValue;
function pipeMultiValue(multi) {
    return (0, index_1.pipe)(PipeMultiValue, { multi });
}
exports.pipeMultiValue = pipeMultiValue;
let ExceptionPipeLine = class ExceptionPipeLine {
    async catch(e, context) {
        return {
            statusCode: 500,
            timestamp: new Date().toISOString(),
            message: e.message
        };
    }
};
ExceptionPipeLine = tslib_1.__decorate([
    (0, inject_1.define)()
], ExceptionPipeLine);
exports.ExceptionPipeLine = ExceptionPipeLine;
function catchError() {
    return (0, index_1.exception)(ExceptionPipeLine, {});
}
exports.catchError = catchError;
//# sourceMappingURL=pipelineTest.js.map