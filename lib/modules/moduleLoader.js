"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModuleLoader = void 0;
const index_1 = require("../../index");
const moduleDecorators_1 = require("./decoreators/moduleDecorators");
const utils_1 = require("@appolo/utils");
const inject_1 = require("@appolo/inject");
const util_1 = require("../util/util");
class ModuleLoader {
    constructor(_moduleParams, _parenInjector, moduleOptions) {
        this._moduleParams = _moduleParams;
        this._parenInjector = _parenInjector;
        this._moduleDefinition = {};
        this._moduleOptions = {};
        this._moduleDefinition = Reflect.getMetadata(moduleDecorators_1.ModuleSymbol, _moduleParams.type) || {};
        if (!this._moduleDefinition) {
            throw new Error(`failed to find moduleDefinition for ${_moduleParams.type}`);
        }
        this._moduleOptions = utils_1.Objects.defaults({}, moduleOptions, {}, { immediate: false, parallel: false });
    }
    get module() {
        return this._module;
    }
    get moduleOptions() {
        return this.module.moduleOptions;
    }
    preInitialize() {
        if (!this._moduleDefinition) {
            return;
        }
        let app = this._createApp(this._parenInjector, this._moduleDefinition);
        this._module = app.injector.get(this._moduleParams.type);
        this._setDefinitions();
        this._module.app = app;
        this._module.moduleOptions = utils_1.Objects.defaults({}, this._moduleParams.options || {}, this._module.defaults);
        this._module.app.injector.addObject("moduleOptions", this._module.moduleOptions, true);
        this._module.app.injector.addObject("discovery", app.discovery, true);
        this._handleFileExport(this._module.app.injector);
    }
    async initialize() {
        try {
            await this._module.beforeModuleInitialize();
            this._handleExports(this._module.app);
            this._handleImports(this._module.app);
            await this._module.beforeModuleLaunch();
            await this._module.app.launch();
            //await this._module.afterModuleInitialize();
        }
        catch (e) {
            util_1.Util.logger(this._parenInjector).error(`failed to initialize module ${this._module.constructor.name}`, { e: e.stack });
            throw e;
        }
    }
    _setDefinitions() {
        if (this._moduleDefinition.options) {
            Object.assign(this._module.moduleOptions, this._moduleDefinition.options);
        }
    }
    _createApp(parent, moduleDefinition) {
        let rootEnv = parent.getObject("env");
        let app = (0, index_1.createApp)({
            root: moduleDefinition.root,
            environment: rootEnv.type
        });
        app.injector.addObject("rootEnv", rootEnv, true);
        app.injector.addObject("env", Object.assign({}, rootEnv, app.env), true);
        Reflect.defineMetadata(moduleDecorators_1.AppModuleOptionsSymbol, this._moduleOptions, app);
        app.injector.parent = parent;
        app.tree.parent = parent.get('app');
        app.register(this._moduleParams.type);
        app.tree.root.event.beforeModulesLoad.on(() => this._module.beforeAppInitialize(), this, { await: true });
        app.event.afterInjectorInitialize.on(() => this._module.afterModuleInitialize(), this, { await: true });
        app.event.afterBootstrap.on(() => this._module.afterModuleLaunch(), this, { await: true });
        app.tree.root.event.afterInjectorInitialize.on(() => this._module.afterAppInitialize(), this, { await: true });
        app.tree.root.event.afterBootstrap.on(() => this._module.afterAppLaunch(), this, { await: true });
        return app;
    }
    _handleExports(app) {
        let moduleExports = [].concat(this._module.exports);
        if (this._moduleDefinition.exports && this._moduleDefinition.exports.length) {
            moduleExports.push(...this._moduleDefinition.exports);
        }
        moduleExports.forEach(item => {
            let id, type;
            if (typeof item == "function") {
                id = inject_1.Util.getClassNameOrId(item);
                type = item;
                app.injector.parent.addDefinition(id, { injector: app.injector });
            }
            else {
                id = item.id;
                type = item.type;
                app.injector.parent.addDefinition(item.id, {
                    injector: app.injector,
                    refName: inject_1.Util.getClassNameOrId(item.type)
                });
            }
            let eventDto = {
                type,
                id,
                module: this._module,
                injector: app.injector
            };
            this._module.app.event.onModuleExport.fireEvent(eventDto);
            this._module.app.tree.parent.event.onModuleExport.fireEvent(eventDto);
        });
    }
    _handleFileExport(injector) {
        this._module.fileExports.forEach(fn => {
            let define = inject_1.Util.getClassDefinition(fn);
            if (define) {
                define = define.clone();
                define.injector(injector);
            }
            this._module.app.tree.parent.discovery.add({ path: "", fn, define: define });
        });
    }
    _handleImports(app) {
        let moduleImports = [].concat(this._module.imports);
        if (this._moduleDefinition.imports && this._moduleDefinition.imports.length) {
            moduleImports.push(...this._moduleDefinition.imports);
        }
        (moduleImports || []).forEach(item => {
            if (typeof item == "function") {
                return;
            }
            app.injector.addDefinition(inject_1.Util.getClassNameOrId(item.type), {
                injector: app.injector.parent,
                refName: item.id
            });
        });
    }
    async reset() {
        await this.module.reset();
    }
    async beforeReset() {
        await this.module.beforeReset();
    }
}
exports.ModuleLoader = ModuleLoader;
//# sourceMappingURL=moduleLoader.js.map