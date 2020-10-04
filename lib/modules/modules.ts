"use strict";
import {Promises, Arrays, Classes, Functions} from '@appolo/utils';
import   path = require('path');
import {Helpers} from "../util/helpers";
import {Injector} from "@appolo/inject";
import {Module} from "./module";
import {Event} from "@appolo/events";
import {IOptions} from "../interfaces/IOptions";
import {IModuleCrt, IModuleOptions, IModuleParams, IPlugin, ModuleArg} from "../interfaces/IModule";
import {ModuleSymbol} from "../decoretors/moduleDecorators";
import {App} from "../app";
import {ModuleLoader} from "./moduleLoader";
import {Util as InjectUtil} from "@appolo/inject";
import {Util} from "../util/util";
import {IApp} from "../interfaces/IApp";
import {EventBeforeModuleInit, EventModuleInit} from "../interfaces/events";


export class ModuleManager {
    private readonly _modules: ModuleLoader[];

    constructor(private _options: IOptions, private _injector: Injector) {
        this._modules = [];
    }

    public moduleAt<T extends Module>(index: number): T {
        let moduleLoader = this._modules[index];

        return moduleLoader ? moduleLoader.module as T : null
    }

    public moduleByType<T extends Module>(type: IModuleCrt): T[] {
        let modules = this._modules.filter(loader => loader.module.constructor.name === type.name).map(loader => loader.module)

        return modules as T[]
    }

    public async loadDynamicModules() {

        for (let i = 0, len = this._modules.length; i < len; i++) {
            this._modules[i].preInitialize();
        }

        await InjectUtil.runRegroupByParallel<ModuleLoader>(this._modules, loader => loader.moduleOptions.parallel, module => this._loadModule(module));
    }

    public async initAfterInjectDynamicModules() {


        await InjectUtil.runRegroupByParallel<ModuleLoader>(this._modules, loader => loader.moduleOptions.parallel, module => module.afterLaunch());
    }

    private async _loadModule(module: ModuleLoader) {
        (this._injector.get<IApp>(App).eventBeforeModuleInit as Event<EventBeforeModuleInit>).fireEvent({module: module.module});

        await module.initialize();

        (this._injector.get<App>(App).eventModuleInit as Event<EventModuleInit>).fireEvent({module: module.module});
    }

    private async _registerModule(moduleParams: IModuleParams, isParallel: boolean) {

        moduleParams.parallel = isParallel;

        let loader = new ModuleLoader(moduleParams, this._injector);

        if (moduleParams.immediate) {
            loader.preInitialize();
            await this._loadModule(loader);
        } else {
            this._modules.push(loader);
        }
    }


    public async load(modules: (ModuleArg | [ModuleArg, { [index: string]: any }?, IModuleOptions?])[]): Promise<any> {

        let moduleParams = modules.map<IModuleParams>((item: any) => {

            let dto: IModuleParams;

            if (Array.isArray(item)) {
                if (Classes.isClass(item[0])) {
                    item = {type: item[0], config: item[1], ...item[2]}
                } else {
                    item = item[0];
                }
            }

            if (Classes.isClass(item)) {
                dto = {type: item, config: {}}
            } else if (Functions.isFunction(item)) {
                dto = {fn: item, config: {}}
            } else {
                dto = {config: {}, ...item}
            }

            return dto;
        })

        let [dynamicModules, staticModules] = Arrays.partition(moduleParams, module => !!module.type)

        await Promises.map(dynamicModules, item => this._registerModule(item, dynamicModules.length > 1));


        await Promises.map(staticModules, item => this._loadStaticModule(item));


    }

    private _loadStaticModule(moduleParams: IModuleParams): PromiseLike<any> {
        //remove the callback arg
        let args = Classes.functionArgsNames(moduleParams.fn),
            lastArg = args[args.length - 1],
            isCallback = false;

        if (['callback', 'next', 'fn', 'func'].indexOf(lastArg) > -1) {
            args = args.slice(0, -1);
            isCallback = true;
        }

        let dependencies = args.map((arg: string) => this._injector.getObject(arg));

        if (isCallback) {
            return Promises.fromCallback((callback) => (moduleParams.fn).apply(moduleParams.fn, dependencies.concat([callback])));
        }

        return Promise.resolve().then(() => (moduleParams.fn).apply(moduleParams.fn, dependencies))
    }

    public async loadStaticModules(): Promise<void> {


        let allPath = path.join(this._options.root, 'config/modules/all.js'),
            environmentPath = path.join(this._options.root, 'config/modules/', this._options.environment + '.js');


        await Util.loadPathWithArgs([allPath, environmentPath], this._injector)
    }

    public reset() {
        return Promise.all(this._modules.map(module => module.reset()));
    }

    public beforeReset() {
        return Promise.all(this._modules.map(module => module.beforeReset()));
    }


}


