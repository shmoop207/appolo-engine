"use strict";
import fs = require('fs');
import {Injector} from "@appolo/inject";
import {ILogger} from "../interfaces/ILogger";
import {Classes, Reflector, Functions} from '@appolo/utils';
import {IExported} from "../modules/interfaces/IModule";
import {Define} from "@appolo/inject";
import {Util as InjectUtil} from "@appolo/inject";

export class Util {

    public static filterByType(exported: IExported[], type: any): IExported[] {
        return (exported || []).filter(item => item.fn === type)
    }

    public static findByType(exported: IExported[], type: any): IExported {
        return (exported || []).find(item => item.fn === type)
    }

    public static findReflectData<T>(exported: IExported[], symbol: Symbol | string): IExported & { metaData: T } {

        return Reflector.findReflectData(symbol, exported)
    }

    public static findAllReflectData<T>(exported: IExported[], symbol: Symbol | string): (IExported & {
        metaData: T
    })[] {

        return Reflector.findAllReflectData(symbol, exported)
    }

    public static setReflectMetadata(key: string | Symbol, value: any, target: any, propertyKey?: string) {
        return Reflector.setMetadata(key, value, target, propertyKey)
    }

    public static getReflectMetadata<T>(symbol: Symbol | string, klass: any, propertyName?: string, defaultValue?: T): T {

        return Reflector.getMetadata(symbol, klass, propertyName, defaultValue)
    }

    public static decorateReflectMetadata(key: string | Symbol, value: any) {
        return Reflector.decorateMetadata(key, value)
    }

    public static getClassDefinition(fn: any): Define {
        return InjectUtil.getClassDefinition(fn)
    }

    public static getClassId(fn: any): string {
        return InjectUtil.getClassId(fn)
    }

    public static getClassName(fn: Function): string {
        return InjectUtil.getClassName(fn)
    }

    public static async loadPathWithArgs(paths: string[], injector: Injector) {

        for (let path of paths) {
            if (!fs.existsSync(path)) {
                continue;
            }
            let modulesFunc = require(path);

            if (!Classes.isFunction(modulesFunc)) {
                continue;
            }
            let args = Classes.functionArgsNames(modulesFunc as any);

            let dependencies = args.map(arg => injector.getObject(arg));

            let result = modulesFunc.apply(modulesFunc, dependencies);

            //check for promise
            if (result && result.then) {
                await result;
            }
        }

    }

    public static logger(injector: Injector): ILogger {

        if (injector.getDefinition("logger")) {
            let logger = injector.get<ILogger>("logger");

            return logger.info && logger.error ? logger : console
        }

        return console
    }

    public static terminate(injector: Injector) {

        return (code, reason) => (err) => {
            if (err && err instanceof Error) {
                Util.logger(injector).error(`process error ${code} ${reason}`);
            }

            Util.logger(injector).info(`process exit code: ${code} reason: ${reason}`)

            setTimeout(() => process.exit(code), 500).unref()
        }
    }
}


