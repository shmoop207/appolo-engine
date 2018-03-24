"use strict";
import {Injector, createContainer, InjectDefineSymbol} from "rocket-inject";

import   path = require('path');
import   fs = require('fs');
import    _ = require('lodash');
import    Q = require('bluebird');
import {IOptions} from "../IOptions";
import {Util} from "../util/util";
import {IBootstrap} from "../IBootstrap";
import {App} from "../app";
import {IEnv} from "../IEnv";
import {FilesLoader} from "../loader/filesLoader";
import {BootstrapSymbol} from "../decorators";
import {ModuleManager} from "../modules/modules";

export class Launcher {

    protected _options: IOptions;
    protected _env: IEnv;
    protected _injector: Injector;
    protected _moduleManager: ModuleManager;

    constructor() {

    }

    protected readonly Defaults = {
        paths: ['config', 'server'],
        root: process.cwd(),
        environment: (process.env.NODE_ENV || 'development'),
        bootStrapClassId: 'appolo-bootstrap'
    };


    public loadOptions(options: IOptions): IOptions {

        let opts = _.defaults(options || {}, this.Defaults);

        this._options = opts;

        return opts;

    }

    public loadEnvironments(): IEnv {
        let allPath = path.join(this._options.root, 'config/environments/all.js'),
            environmentPath = path.join(this._options.root, 'config/environments/', this._options.environment + '.js'),
            env: IEnv = {};

        if (fs.existsSync(allPath)) {

            let all = require(allPath);

            let environment = fs.existsSync(environmentPath) ? require(environmentPath) : {};

            //add current env config to appolo env
            _.defaultsDeep(env, environment || {}, all);

            //save evn name
            env.type = this._options.environment;

            let pkg = require(path.join(this._options.root, 'package.json'));

            env.version = pkg ? pkg.version : "";

            //add root
            env.rootDir = this._options.root;

        }

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

    public createModuleManager(): ModuleManager {
        this._moduleManager = new ModuleManager(this._options, this._injector);
        return this._moduleManager
    }


    public async launch(): Promise<void> {

        await this._moduleManager.loadStaticModules();

        this._loadFiles();

        await this._moduleManager.loadDynamicModules();


        await this._injector.initialize();

        await this._loadBootStrap();
    }


    private _loadFiles() {
        let loadPaths = _.union(this._options.paths, this._env.paths);

        //load env files
        for (let filePath of FilesLoader.load(this._options.root, loadPaths)) {
            try {
                let exported: any = require(filePath);

                let keys = Object.keys(exported);

                for (let i = 0, len = keys.length; i < len; i++) {
                    let key = keys[i];
                    let fn = exported[key];

                    if (!_.isFunction(fn)) {
                        continue;
                    }

                    this._handleKlass(fn);

                }
            } catch (e) {
                console.error(`failed to require ${filePath}`);

                throw e
            }
        }
    }

    private _handleKlass(fn: Function) {
        let define = Reflect.hasMetadata(InjectDefineSymbol, fn);

        if (define) {
            this._injector.register(fn)
        }

        if (Reflect.hasMetadata(BootstrapSymbol, fn)) {
            this._options.bootStrapClassId = Util.getClassName(fn);
        }
    }

    private async _loadBootStrap(): Promise<void> {

        let bootstrapDef = this._injector.getDefinition(this._options.bootStrapClassId);

        if (!bootstrapDef) {
            return Promise.resolve();
        }

        let bootstrap = this._injector.getObject<IBootstrap>(this._options.bootStrapClassId);

        await bootstrap.run();
    }

}

