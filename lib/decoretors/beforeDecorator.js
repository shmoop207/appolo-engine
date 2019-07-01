"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("../util/util");
const _ = require("lodash");
exports.BeforeSymbol = Symbol("__before__");
exports.AfterSymbol = Symbol("__after__");
function decorate(symbol, klass, action) {
    return function (target, propertyKey, descriptor) {
        let data = util_1.Util.getReflectData(symbol, target.constructor, {});
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
    };
}
function before(klass, action) {
    return decorate(exports.BeforeSymbol, klass, action);
}
exports.before = before;
function after(klass, action) {
    return decorate(exports.AfterSymbol, klass, action);
}
exports.after = after;
function handleBeforeDecorator(target, app) {
    baseHandler(target, app, exports.BeforeSymbol, extendBefore);
}
exports.handleBeforeDecorator = handleBeforeDecorator;
function handleAfterDecorator(target, app) {
    baseHandler(target, app, exports.AfterSymbol, extendAfter);
}
exports.handleAfterDecorator = handleAfterDecorator;
function baseHandler(target, app, symbol, handler) {
    let meta = util_1.Util.getReflectData(symbol, target);
    if (!meta) {
        return;
    }
    _.forEach(meta, item => {
        if (item.isOverride) {
            return;
        }
        let old = target.prototype[item.propertyKey];
        item.isOverride = true;
        target.prototype[item.propertyKey] = handler(old, app, item);
    });
}
function extendAfter(old, app, item) {
    return async function () {
        let args = Array.from(arguments);
        let result = await old.apply(this, args);
        for (let action of item.items) {
            let handler = app.injector.get(action.klass);
            let handlerAction = _.isFunction(action.action) ? action.action(handler) : handler[action.action || "run"];
            result = await handlerAction.apply(this, [result]);
        }
        return result;
    };
}
function extendBefore(old, app, item) {
    return async function () {
        let args = Array.from(arguments);
        for (let action of item.items) {
            let handler = app.injector.get(action.klass);
            let handlerAction = _.isFunction(action.action) ? action.action(handler) : handler[action.action || "run"];
            args = await handlerAction.apply(handler, args);
            if (!_.isArray(args)) {
                args = [args];
            }
        }
        return old.apply(this, args);
    };
}
//# sourceMappingURL=beforeDecorator.js.map