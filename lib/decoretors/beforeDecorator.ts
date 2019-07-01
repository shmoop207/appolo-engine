import {Util} from "../util/util";
import {IClass} from "../interfaces/IModuleDefinition";
import {App} from "../app";
import _ = require('lodash');

export const BeforeSymbol = Symbol("__before__");
export const AfterSymbol = Symbol("__after__");

interface IActions {
    [index: string]: IActionsItem
}

interface IActionsItem
{
    isOverride?:boolean,
    items: { klass: IClass, action?: (c: any) => Function | string }[]
    propertyKey: string

}

function decorate<T>(symbol: Symbol, klass: IClass, action?: (c: T) => Function | string) {
    return function (target: any, propertyKey: string, descriptor?: PropertyDescriptor) {

        let data = Util.getReflectData<IActions>(symbol, target.constructor, {});

        if (!data[propertyKey]) {
            data[propertyKey] = {
                items: [],
                propertyKey
            };
        }

        data[propertyKey].items.push({
            klass: klass,
            action: action
        });
    }
}

export function before<T>(klass: IClass, action: (c: T) => Function) {
    return decorate<T>(BeforeSymbol, klass, action);
}

export function after<T>(klass: IClass, action: (c: T) => Function) {
    return decorate<T>(AfterSymbol, klass, action);
}

export function handleBeforeDecorator(target: any, app: App) {
    baseHandler(target,app,BeforeSymbol,extendBefore)
}


export function handleAfterDecorator(target: any, app: App) {
    baseHandler(target,app,AfterSymbol,extendAfter)
}

function baseHandler(target: any, app: App,symbol:Symbol,handler:Function){
    let meta = Util.getReflectData<IActions>(symbol, target);

    if (!meta) {
        return;
    }

    _.forEach(meta, item => {

        if(item.isOverride){
            return;
        }

        let old = target.prototype[item.propertyKey];

        item.isOverride =  true;

        target.prototype[item.propertyKey] = handler(old,app,item)
    })
}


 function  extendAfter(old:Function,app:App,item:IActionsItem) {
    return async function(){
        let args = Array.from(arguments);

        let result = await old.apply(this, args);

        for (let action of item.items) {
            let handler = app.injector.get(action.klass);

            let handlerAction = _.isFunction(action.action) ? action.action(handler) : handler[action.action || "run"];

            result = await handlerAction.apply(this, [result])
        }

        return result
    }

}

 function  extendBefore(old:Function,app:App,item:IActionsItem) {
    return async function(){
        let args = Array.from(arguments);

        for (let action of item.items) {
            let handler = app.injector.get(action.klass);

            let handlerAction = _.isFunction(action.action) ? action.action(handler) : handler[action.action || "run"];

            args = await handlerAction.apply(handler, args);

            if (!_.isArray(args)) {
                args = [args];
            }
        }

        return old.apply(this, args)
    }

}