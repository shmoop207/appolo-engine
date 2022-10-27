"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Launcher = void 0;
const tslib_1 = require("tslib");
const inject_1 = require("@appolo/inject");
const filesLoader_1 = require("../loader/filesLoader");
const modulesManager_1 = require("../modules/modulesManager");
const bootstrapDecorator_1 = require("../bootstrap/bootstrapDecorator");
const moduleDecorators_1 = require("../modules/decoreators/moduleDecorators");
const path = require("path");
const fs = require("fs");
const utils_1 = require("@appolo/utils");
const pipelineManager_1 = require("../pipelines/pipelineManager");
const propertyDecorators_1 = require("../decoretors/propertyDecorators");
const inject_2 = require("@appolo/inject");
class Launcher {
    constructor(app) {
        this._isInitialized = false;
        this._files = [];
        this.Defaults = {
            paths: ['src'],
            root: process.cwd(),
            environment: (process.env.NODE_ENV || 'development'),
            bootStrapClassId: 'appolo-afterBootstrap'
        };
        this._app = app;
    }
    loadOptions(options) {
        let opts = utils_1.Objects.defaults(options || {}, this.Defaults);
        this._options = opts;
        return opts;
    }
    loadEnvironments() {
        let allPath = path.join(this._options.root, 'config/env/all.js'), environmentPath = path.join(this._options.root, 'config/env/', this._options.environment + '.js'), env = {};
        if (fs.existsSync(allPath)) {
            let all = require(allPath);
            let environment = fs.existsSync(environmentPath) ? require(environmentPath) : {};
            //add current env config to appolo env
            utils_1.Objects.defaults(env, environment || {}, all);
        }
        //save evn name
        env.type = this._options.environment;
        let pkgPath = path.join(this._options.root, 'package.json');
        env.version = fs.existsSync(pkgPath) ? require(pkgPath).version : "";
        //add root
        env.rootDir = this._options.root;
        this._env = env;
        return env;
    }
    loadInject() {
        this._injector = (0, inject_1.createContainer)();
        this._injector.addObject("environment", this._env);
        this._injector.addObject("env", this._env);
        this._injector.addObject("inject", this._injector);
        this._injector.addObject("injector", this._injector);
        return this._injector;
    }
    createModuleManager() {
        this._moduleManager = new modulesManager_1.ModulesManager(this._options, this._injector);
        return this._moduleManager;
    }
    createPipelineManager() {
        this._pipelineManager = new pipelineManager_1.PipelineManager(this._injector, this._app);
        this._pipelineManager.initialize();
        return this._pipelineManager;
    }
    async launch() {
        this._moduleOptions = Reflect.getMetadata(moduleDecorators_1.AppModuleOptionsSymbol, this._app) || {};
        if (this._isInitialized) {
            return;
        }
        await this._initFiles();
        await this.initStaticModules();
        await this.initDynamicModules();
        this._handlePipeLines();
        if (this._app.tree.parent && !this._moduleOptions.immediate) {
            return;
        }
        await this.initInjector();
        await this.initBootStrap();
        this._isInitialized = true;
    }
    async initStaticModules() {
        if (this._isInitialized) {
            return;
        }
        for (let app of this._app.tree.children) {
            await app.launcher.initStaticModules();
        }
        await this._moduleManager.loadStaticModules();
    }
    async initDynamicModules() {
        if (this._isInitialized) {
            return;
        }
        for (let app of this._app.tree.children) {
            await app.launcher.initDynamicModules();
        }
        await this._moduleManager.loadDynamicModules();
    }
    async initInjector() {
        if (this._isInitialized) {
            return;
        }
        this._injector.events.instanceOwnCreated.on(this._onInstanceCreated, this);
        await inject_2.Util.runRegroupByParallel(this._app.tree.children, app => (Reflect.getMetadata(moduleDecorators_1.AppModuleOptionsSymbol, app) || {}).parallel, app => app.launcher.initInjector());
        await this._app.event.beforeInjectorInitialize.fireEventAsync();
        this._injector.events.afterInitialize.on(() => this._app.event.afterInjectorInitialize.fireEventAsync(), this, { await: true });
        await this._injector.initialize({
            immediate: this._moduleOptions.immediate,
            parallel: this._moduleOptions.parallel
        });
    }
    async _onInstanceCreated(action) {
        this._pipelineManager.overrideKlassInstance(action.definition.type, action.definition, action.instance);
    }
    async initBootStrap() {
        if (this._isInitialized) {
            return;
        }
        await this._app.event.beforeBootstrap.fireEventAsync();
        await inject_2.Util.runRegroupByParallel(this._app.tree.children, app => (Reflect.getMetadata(moduleDecorators_1.AppModuleOptionsSymbol, app) || {}).parallel, app => app.launcher.initBootStrap());
        let bootstrapDef = this._injector.getDefinition(this._options.bootStrapClassId);
        if (!bootstrapDef) {
            await this._app.event.afterBootstrap.fireEventAsync();
            return Promise.resolve();
        }
        let bootstrap = this._injector.getObject(this._options.bootStrapClassId);
        await bootstrap.run();
        await this._app.event.afterBootstrap.fireEventAsync();
        this._isInitialized = true;
        await this._app.event.afterLaunch.fireEventAsync();
    }
    async _initFiles() {
        var e_1, _a;
        if (this._isInitialized) {
            return;
        }
        await utils_1.Promises.map(this._app.tree.children, app => app.launcher._initFiles());
        let loadPaths = (this._options.paths || []).concat(this._env.paths || []);
        try {
            for (var _b = tslib_1.__asyncValues(filesLoader_1.FilesLoader.load(this._options.root, loadPaths)), _c; _c = await _b.next(), !_c.done;) {
                let filePath = _c.value;
                try {
                    let exported = require(filePath);
                    this._handleExported(exported, filePath);
                }
                catch (e) {
                    console.error(`failed to require ${filePath}`);
                    throw e;
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) await _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
    }
    _handleExported(exported, filePath) {
        let keys = Object.keys(exported || {});
        for (let i = 0, len = keys.length; i < len; i++) {
            let key = keys[i], fn = exported[key];
            if (!utils_1.Classes.isFunction(fn)) {
                continue;
            }
            this._handleFn(fn, filePath);
        }
    }
    _handleFn(fn, filePath) {
        let hasDefine = Reflect.hasMetadata(inject_1.InjectDefineSymbol, fn);
        let define = null;
        if (hasDefine) {
            this._app.event.beforeInjectRegister.fireEvent({ type: fn, filePath });
            define = this._injector.register(fn, null, filePath);
            this._files.push(filePath);
        }
        this._app.discovery.add({
            path: filePath,
            fn: fn,
            define
        });
        this._app.event.onClassExport.fireEvent({ type: fn, filePath });
        if (Reflect.hasMetadata(bootstrapDecorator_1.BootstrapSymbol, fn)) {
            this._options.bootStrapClassId = inject_2.Util.getClassName(fn);
        }
    }
    _handlePipeLines() {
        for (let i = 0, len = (this._app.discovery.exported || []).length; i < len; i++) {
            let item = this._app.discovery.exported[i];
            (0, propertyDecorators_1.handleBeforeDecorator)(item.fn, this._app);
            (0, propertyDecorators_1.handleAfterDecorator)(item.fn, this._app);
            if (item.define) {
                this._pipelineManager.overrideKlassType(item.fn, item.define.definition);
                this._pipelineManager.overrideKlassMethods(item.fn, item.define.definition);
                this._app.event.afterInjectRegister.fireEvent({
                    type: item.fn,
                    filePath: item.path,
                    definition: item.define.definition
                });
            }
        }
    }
    async reset() {
        var e_2, _a;
        await this._moduleManager.beforeReset();
        this._files.forEach(file => {
            delete require.cache[file];
        });
        this._app.discovery.exported.forEach(file => {
            delete require.cache[file.path];
        });
        try {
            for (var _b = tslib_1.__asyncValues(filesLoader_1.FilesLoader.load(this._options.root, ["config"])), _c; _c = await _b.next(), !_c.done;) {
                let filePath = _c.value;
                delete require.cache[filePath];
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) await _a.call(_b);
            }
            finally { if (e_2) throw e_2.error; }
        }
        this._pipelineManager.reset();
        await this._moduleManager.reset();
        this._files.length = 0;
        this._app = null;
    }
}
exports.Launcher = Launcher;
//# sourceMappingURL=launcher.js.map