"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.module = exports.AppModuleOptionsSymbol = exports.ModuleSymbol = void 0;
const path = require("path");
const helpers_1 = require("../../util/helpers");
const inject_1 = require("@appolo/inject");
exports.ModuleSymbol = "__module__";
exports.AppModuleOptionsSymbol = "__appModuleOptionsSymbol__";
function module(options) {
    options = options || {};
    options.root = path.dirname(helpers_1.Helpers.callerPath());
    return function (fn) {
        (0, inject_1.define)()(fn);
        Reflect.defineMetadata(exports.ModuleSymbol, options, fn);
    };
}
exports.module = module;
//# sourceMappingURL=moduleDecorators.js.map