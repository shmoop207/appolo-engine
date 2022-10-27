"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PipelineManager = void 0;
const pipelineDecorators_1 = require("./decoreators/pipelineDecorators");
const pipelineRunner_1 = require("./pipelineRunner");
const utils_1 = require("@appolo/utils");
const inject_1 = require("@appolo/inject");
const util_1 = require("../util/util");
class PipelineManager {
    constructor(_injector, _app) {
        this._injector = _injector;
        this._app = _app;
        this._methodsOverride = [];
    }
    initialize() {
    }
    overrideKlassMethods(fn, definition) {
        if (!inject_1.Util.isClass(fn)) {
            return;
        }
        let metadata = utils_1.Reflector.getOwnMetadata(pipelineDecorators_1.PipeSymbol, fn);
        Object.keys(metadata || {}).forEach(action => {
            this.overrideKlassMethod(metadata[action], fn, definition, action);
        });
    }
    overrideKlassType(fn, definition, instance) {
        let metadata = utils_1.Reflector.getOwnMetadata(pipelineDecorators_1.PipeKlassRegisterSymbol, fn);
        return this._overrideKlass(metadata, fn, definition);
    }
    overrideKlassInstance(fn, definition, instance) {
        let metadata = utils_1.Reflector.getOwnMetadata(pipelineDecorators_1.PipeInstanceCreateSymbol, fn);
        return this._overrideKlass(metadata, fn, definition, instance);
    }
    _overrideKlass(pipelines, fn, definition, instance) {
        try {
            if (!pipelines || !pipelines.length) {
                return;
            }
            pipelines = utils_1.Objects.cloneDeep(pipelines);
            this._convertPipeline(pipelines);
            pipelines = pipelines.reverse();
            let pipesCompiled = (0, pipelineRunner_1.runPipes)(pipelines);
            return pipesCompiled({ definition, injector: this._injector, args: null, instance, type: fn, action: null, argsTypes: [] });
        }
        catch (e) {
            util_1.Util.logger(this._app.injector).error("failed to override klass");
        }
    }
    overrideKlassMethod(pipelines, fn, definition, action) {
        pipelines = utils_1.Objects.cloneDeep(pipelines);
        this._convertPipeline(pipelines);
        let old = fn.prototype[action];
        pipelines = pipelines.reverse();
        pipelines.push({
            pipeline: (context, next) => {
                let fn = old["__PIPELINE__"] ? old["__PIPELINE__"] : old;
                return fn.apply(context.instance, context.arguments);
            }
        });
        let argsTypes = Reflect.getMetadata("design:paramtypes", fn.prototype, action) || [];
        let pipesCompiled = (0, pipelineRunner_1.runPipes)(pipelines);
        let injector = this._injector;
        fn.prototype[action] = async function () {
            let result = await pipesCompiled({
                definition,
                injector: injector,
                args: arguments,
                instance: this,
                type: fn,
                action,
                argsTypes
            });
            return result;
        };
        fn.prototype[action]["__PIPELINE__"] = old;
        this._methodsOverride.push({ klass: fn, property: action, old: old["__PIPELINE__"] ? old["__PIPELINE__"] : old });
    }
    _convertPipeline(pipes) {
        pipes.forEach((pipe, index) => {
            let id = inject_1.Util.getClassId(pipe.pipeline);
            if (!id) {
                return;
            }
            let injector = this._injector;
            pipe.pipeline = (context, next) => {
                let pipeline = injector.get(id);
                return pipeline.run(context, next);
            };
        });
    }
    reset() {
        this._methodsOverride.forEach(item => {
            item.klass.prototype[item.property] = item.old;
        });
    }
}
exports.PipelineManager = PipelineManager;
//# sourceMappingURL=pipelineManager.js.map