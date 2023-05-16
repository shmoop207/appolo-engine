"use strict";
import {createContainer, Define, InjectDefineSymbol, Injector, IDefinition} from "@appolo/inject";
import {IOptions} from "../interfaces/IOptions";
import {IBootstrap} from "../bootstrap/IBootstrap";
import {IEnv} from "../interfaces/IEnv";
import {Event} from "@appolo/events";
import {FilesLoader} from "../loader/filesLoader";
import {ModulesManager} from "../modules/modulesManager";
import {IClass, IExported, IModuleOptions} from "../modules/interfaces/IModule";
import {App} from "../app/app";
import {BootstrapSymbol} from "../bootstrap/bootstrapDecorator";
import {AppModuleOptionsSymbol} from "../modules/decoreators/moduleDecorators";
import {IApp} from "../app/IApp";
import path = require('path');
import fs = require('fs');
import {Objects, Classes, Promises} from '@appolo/utils';
import {PipelineManager} from "../pipelines/pipelineManager";
import {handleAfterDecorator, handleBeforeDecorator} from "../decoretors/propertyDecorators";
import {Util as InjectUtils} from "@appolo/inject";
import {Util as EngineUtils} from "../util/util";
import {EventBeforeInjectRegister, EventClassExport, EventInjectRegister} from "../events/IEvents";

export class Launcher {

    protected _options: IOptions;
    protected _env: IEnv;
    protected _injector: Injector;
    protected _moduleManager: ModulesManager;
    protected _pipelineManager: PipelineManager;
    protected _app: App;
    private _isInitialized: boolean = false;
    private _files: string[] = [];
    private _moduleOptions: IModuleOptions;

    constructor(app: App) {
        this._app = app;
    }

    protected readonly Defaults = {
        paths: ['src'],
        root: process.cwd(),
        environment: (process.env.NODE_ENV || 'development'),
        bootStrapClassId: 'appolo-afterBootstrap'
    };


    public loadOptions(options: IOptions): IOptions {

        let opts = Objects.defaults(options || {}, this.Defaults);

        this._options = opts;
        return opts;

    }

    public loadEnvironments(): IEnv {
        let allPath = path.join(this._options.root, 'config/env/all.js'),
            environmentPath = path.join(this._options.root, 'config/env/', this._options.environment + '.js'),
            env: IEnv = {};

        if (fs.existsSync(allPath)) {

            let all = require(allPath);

            let environment = fs.existsSync(environmentPath) ? require(environmentPath) : {};

            //add current env config to appolo env
            Objects.defaults(env, environment || {}, all);
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


    public loadInject(): Injector {

        this._injector = createContainer();

        this._injector.addObject("environment", this._env);
        this._injector.addObject("env", this._env);
        this._injector.addObject("inject", this._injector);
        this._injector.addObject("injector", this._injector);


        return this._injector;
    }

    public createModuleManager(): ModulesManager {
        this._moduleManager = new ModulesManager(this._options, this._injector);
        return this._moduleManager
    }

    public createPipelineManager(): PipelineManager {
        this._pipelineManager = new PipelineManager(this._injector, this._app);

        this._pipelineManager.initialize();

        return this._pipelineManager
    }


    public async launch(): Promise<void> {

        this._moduleOptions = Reflect.getMetadata(AppModuleOptionsSymbol, this._app) || {};


        if (this._isInitialized) {
            return;
        }

        this._handleProcessError();

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

    protected async initStaticModules() {
        if (this._isInitialized) {
            return;
        }
        for (let app of this._app.tree.children) {
            await (app as App).launcher.initStaticModules()
        }
        await this._moduleManager.loadStaticModules();
    }

    protected async initDynamicModules() {
        if (this._isInitialized) {
            return;
        }
        for (let app of this._app.tree.children) {
            await (app as App).launcher.initDynamicModules();

        }

        await this._moduleManager.loadDynamicModules();

    }

    protected async initInjector() {
        if (this._isInitialized) {
            return;
        }

        this._injector.events.instanceOwnCreated.on(this._onInstanceCreated, this);

        await InjectUtils.runRegroupByParallel<IApp>(this._app.tree.children, app => (Reflect.getMetadata(AppModuleOptionsSymbol, app) || {}).parallel, app => (app as App).launcher.initInjector());

        await (this._app.event.beforeInjectorInitialize as Event<void>).fireEventAsync();

        this._injector.events.afterInitialize.on(() => (this._app.event.afterInjectorInitialize as Event<void>).fireEventAsync(), this, {await: true});


        await this._injector.initialize({
            immediate: this._moduleOptions.immediate,
            parallel: this._moduleOptions.parallel
        });

    }

    private async _onInstanceCreated(action: { instance: any, definition: IDefinition }) {
        this._pipelineManager.overrideKlassInstance(action.definition.type, action.definition, action.instance);
    }

    protected async initBootStrap(): Promise<void> {
        if (this._isInitialized) {
            return;
        }

        await (this._app.event.beforeBootstrap as Event<void>).fireEventAsync();

        await InjectUtils.runRegroupByParallel<IApp>(this._app.tree.children, app => (Reflect.getMetadata(AppModuleOptionsSymbol, app) || {}).parallel, app => (app as App).launcher.initBootStrap());

        let bootstrapDef = this._injector.getDefinition(this._options.bootStrapClassId);

        if (!bootstrapDef) {
            await (this._app.event.afterBootstrap as Event<void>).fireEventAsync();

            return Promise.resolve();
        }

        let bootstrap = this._injector.getObject<IBootstrap>(this._options.bootStrapClassId);


        await bootstrap.run();

        await (this._app.event.afterBootstrap as Event<void>).fireEventAsync();

        this._isInitialized = true;

        await (this._app.event.afterLaunch as Event<void>).fireEventAsync();

    }


    private async _initFiles() {

        if (this._isInitialized) {
            return;
        }

        await Promises.map(this._app.tree.children, app => (app as App).launcher._initFiles())

        let loadPaths = (this._options.paths || []).concat(this._env.paths || []);

        for await (let filePath of FilesLoader.load(this._options.root, loadPaths)) {
            try {
                let exported: any = require(filePath);

                this._handleExported(exported, filePath);

            } catch (e) {
                console.error(`failed to require ${filePath}`);

                throw e
            }
        }
    }

    private _handleExported(exported: any, filePath: string) {
        let keys = Object.keys(exported || {});

        for (let i = 0, len = keys.length; i < len; i++) {
            let key = keys[i], fn = exported[key];

            if (!Classes.isFunction(fn)) {
                continue;
            }

            this._handleFn(fn, filePath);
        }
    }

    private _handleFn(fn: Function, filePath: string) {
        let hasDefine = Reflect.hasMetadata(InjectDefineSymbol, fn);
        let define: Define = null;

        if (hasDefine) {
            (this._app.event.beforeInjectRegister as Event<EventBeforeInjectRegister>).fireEvent({type: fn, filePath});
            define = this._injector.register(fn as IClass, null, filePath);
            this._files.push(filePath);
        }

        this._app.discovery.add({
            path: filePath,
            fn: fn,
            define
        });

        (this._app.event.onClassExport as Event<EventClassExport>).fireEvent({type: fn, filePath});


        if (Reflect.hasMetadata(BootstrapSymbol, fn)) {
            this._options.bootStrapClassId = InjectUtils.getClassName(fn);
        }


    }

    private _handlePipeLines() {

        for (let i = 0, len = (this._app.discovery.exported || []).length; i < len; i++) {
            let item = this._app.discovery.exported[i];

            handleBeforeDecorator(item.fn, this._app);
            handleAfterDecorator(item.fn, this._app);

            if (item.define) {
                this._pipelineManager.overrideKlassType(item.fn, item.define.definition);
                this._pipelineManager.overrideKlassMethods(item.fn, item.define.definition);
                (this._app.event.afterInjectRegister as Event<EventInjectRegister>).fireEvent({
                    type: item.fn,
                    filePath: item.path,
                    definition: item.define.definition
                })
            }
        }
    }


    public async reset() {

        await this._moduleManager.beforeReset();

        this._files.forEach(file => {
            delete require.cache[file];
        });

        this._app.discovery.exported.forEach(file => {
            delete require.cache[file.path];
        });


        for await (let filePath of FilesLoader.load(this._options.root, ["config"])) {
            delete require.cache[filePath]
        }

        this._pipelineManager.reset();

        await this._moduleManager.reset();

        this._files.length = 0;
        this._app = null;
    }

    private _handleProcessError() {
        if (!this._options.logProcessErrors || this._app.tree.parent) {
            return;
        }

        process.once('uncaughtException', EngineUtils.terminate(this._injector)(1, 'Unexpected Error'))
        process.once('unhandledRejection', EngineUtils.terminate(this._injector)(1, 'Unhandled Promise'))
        process.once('SIGTERM', EngineUtils.terminate(this._injector)(0, 'SIGTERM'))
        process.once('SIGINT', EngineUtils.terminate(this._injector)(0, 'SIGINT'))
    }


}


