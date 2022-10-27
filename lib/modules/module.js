"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Module = void 0;
const tslib_1 = require("tslib");
const inject_1 = require("@appolo/inject");
let i = 0;
let Module = class Module {
    constructor() {
        this._exports = [];
        this._fileExports = [];
        this._imports = [];
        this.Defaults = {};
    }
    get defaults() {
        return this.Defaults;
    }
    static for(options) {
        return { type: this, options };
    }
    get app() {
        return this._app;
    }
    set app(value) {
        this._app = value;
    }
    get parent() {
        return this._app.tree.parent;
    }
    get root() {
        return this._app.tree.root;
    }
    get rootParent() {
        return this._app.tree.root;
    }
    get exports() {
        return this._exports;
    }
    set exports(value) {
        this._exports = value;
    }
    get fileExports() {
        return this._fileExports;
    }
    set fileExports(value) {
        this._fileExports = value;
    }
    set imports(value) {
        this._imports = value;
    }
    get imports() {
        return this._imports;
    }
    get moduleOptions() {
        return this._moduleOptions;
    }
    set moduleOptions(value) {
        this._moduleOptions = value;
    }
    beforeAppInitialize() {
    }
    beforeModuleInitialize() {
    }
    beforeModuleLaunch() {
    }
    onInjectInitialize() {
    }
    onInjectBootstrap() {
    }
    afterModuleInitialize() {
    }
    afterModuleLaunch() {
    }
    afterAppInitialize() {
    }
    afterAppLaunch() {
    }
    beforeReset() {
    }
    reset() {
    }
};
tslib_1.__decorate([
    (0, inject_1.initAsync)(),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", void 0)
], Module.prototype, "onInjectInitialize", null);
tslib_1.__decorate([
    (0, inject_1.bootstrapAsync)(),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", void 0)
], Module.prototype, "onInjectBootstrap", null);
Module = tslib_1.__decorate([
    (0, inject_1.singleton)()
], Module);
exports.Module = Module;
//# sourceMappingURL=module.js.map