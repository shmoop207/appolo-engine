import {Module} from "./module";
import {App} from "../app";
import {Injector, InjectDefineSymbol} from "@appolo/inject";
import {IEnv} from "../interfaces/IEnv";
import {createApp, IApp, IClass} from "../../index";
import {AppModuleOptionsSymbol, ModuleSymbol} from "../decoretors/moduleDecorators";
import {Promises, Arrays, Objects} from '@appolo/utils';
import {IModuleDefinition, IModuleOptions, IModuleParams} from "../interfaces/IModule";
import {Util as InjectUtil} from "@appolo/inject";
import {Event} from "@appolo/events";
import {Util} from "../util/util";
import {EventModuleExport} from "../interfaces/events";

export class ModuleLoader {

    protected _moduleDefinition: IModuleDefinition = {};
    protected _moduleOptions: IModuleOptions = {}
    protected _module: Module;


    constructor(protected _moduleParams: IModuleParams, protected _parenInjector: Injector) {

        this._moduleDefinition = Reflect.getMetadata(ModuleSymbol, _moduleParams.module);

        if (!this._moduleDefinition) {
            throw new Error(`failed to find moduleDefinition for ${_moduleParams.module}`)
        }

        this._moduleOptions = Objects.defaults({}, _moduleParams.moduleOptions, {
            immediate: this._moduleDefinition?.immediate,
            parallel: this._moduleDefinition?.parallel
        }, {immediate: false, parallel: false});
    }

    public get module(): Module {
        return this._module
    }

    public get moduleOptions(): IModuleOptions {
        return this.module.moduleOptions
    }

    public preInitialize() {
        if (!this._moduleDefinition) {
            return;
        }

        let app = this._createApp(this._parenInjector, this._moduleDefinition);

        this._module = app.injector.get(this._moduleParams.module)

        this._setDefinitions();

        this._module.app = app

        this._module.moduleOptions = Objects.defaults({}, this._moduleParams.options || {}, this._module.defaults);

        this._module.app.injector.addObject("moduleOptions", this._module.moduleOptions, true);
        this._module.app.injector.addObject("discovery", app.discovery, true);

        this._handleFileExport();

    }


    public async initialize(): Promise<void> {

        try {


            await this._module.beforeInitialize();

            // await this._loadInnerModules(this._module.app, this._moduleDefinition);

            this._handleExports(this._module.app);

            this._handleImports(this._module.app);

            await this._module.beforeLaunch();

            //this._fireClassExportEvents();

            await this._module.app.launch();

            await this._module.afterInitialize();


        } catch (e) {
            Util.logger(this._parenInjector).error(`failed to initialize module ${this._module.constructor.name}`, {e: e.stack});

            throw e;
        }
    }

    public async afterLaunch(): Promise<void> {
        await this._module.afterLaunch();
    }


    // private _fireClassExportEvents() {
    //     if (!this._module.app.hasListener(Events.ClassExport) && !this._module.app.hasListener(Events.InjectRegister)) {
    //         return;
    //     }
    //
    //     this._module.app.parent.discovery.exported.forEach(item => {
    //
    //         if (Reflect.hasMetadata(InjectDefineSymbol, item.fn)) {
    //
    //             this._module.app.fireEvent(Events.InjectRegister, item.fn, item.path);
    //         }
    //
    //         this._module.app.fireEvent(Events.ClassExport, item.fn, item.path);
    //     })
    // }

    private _setDefinitions() {
        if (this._moduleDefinition.options) {
            Object.assign(this._module.moduleOptions, this._moduleDefinition.options)
        }
    }

    private _createApp(parent: Injector, moduleDefinition: IModuleDefinition): App {


        let rootEnv = parent.getObject<IEnv>("env");

        let app = createApp({
            root: moduleDefinition.root,
            environment: rootEnv.type
        });

        app.injector.addObject("rootEnv", rootEnv, true);
        app.injector.addObject("env", Object.assign({}, rootEnv, app.env), true);

        Reflect.defineMetadata(AppModuleOptionsSymbol, this._moduleOptions, app);

        app.injector.parent = parent;

        app.parent = parent.get<App>('app');

        app.register(this._moduleParams.module)

        return app;
    }

    // private async _loadInnerModules(app: IApp, moduleDefinition: IModuleDefinition) {
    //
    //     if (!moduleDefinition.modules) {
    //         return;
    //     }
    //
    //     for (let module of moduleDefinition.modules) {
    //         let moduleInstance = module instanceof Module ? module : new (module as typeof Module);
    //
    //         let moduleLoader = new ModuleLoader(moduleInstance, app.injector);
    //
    //         moduleLoader.preInitialize();
    //
    //         await moduleLoader.initialize();
    //     }
    // }

    private _handleExports(app: IApp) {

        let moduleExports = [].concat(this._module.exports);

        if (this._moduleDefinition.exports && this._moduleDefinition.exports.length) {
            moduleExports.push(...this._moduleDefinition.exports)
        }

        moduleExports.forEach(item => {


            let id, type;

            if (typeof item == "function") {
                id = InjectUtil.getClassNameOrId(item as IClass);
                type = item;
                app.injector.parent.addDefinition(id, {injector: app.injector})
            } else {
                id = item.id;
                type = item.type;
                app.injector.parent.addDefinition(item.id, {
                    injector: app.injector,
                    refName: InjectUtil.getClassNameOrId(item.type)
                })
            }

            let eventDto = {
                type,
                id,
                module: this._module,
                injector: app.injector
            };

            (this._module.app.eventModuleExport as Event<EventModuleExport>).fireEvent(eventDto);
            (this._module.app.parent.eventModuleExport as Event<EventModuleExport>).fireEvent(eventDto);

        });


    }

    private _handleFileExport() {
        this._module.fileExports.forEach(fn => {
            (this._module.app.parent as App).discovery.add({path: "", fn, define: InjectUtil.getClassDefinition(fn)})
        })
    }

    private _handleImports(app: IApp) {

        let moduleImports = [].concat(this._module.imports);

        if (this._moduleDefinition.imports && this._moduleDefinition.imports.length) {
            moduleImports.push(...this._moduleDefinition.imports)
        }

        (moduleImports || []).forEach(item => {

            if (typeof item == "function") {
                return;
            }

            app.injector.addDefinition(InjectUtil.getClassNameOrId(item.type), {
                injector: app.injector.parent,
                refName: item.id
            })
        });
    }

    public async reset(){
         await this.module.reset();
    }

    public async beforeReset(){
         await this.module.beforeReset();
    }
}
