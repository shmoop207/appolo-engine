"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./lib/app");
var util_1 = require("./lib/util/util");
exports.Util = util_1.Util;
var event_dispatcher_1 = require("./lib/events/event-dispatcher");
exports.EventDispatcher = event_dispatcher_1.EventDispatcher;
var launcher_1 = require("./lib/launcher/launcher");
exports.Launcher = launcher_1.Launcher;
var filesLoader_1 = require("./lib/loader/filesLoader");
exports.FilesLoader = filesLoader_1.FilesLoader;
var appolo_inject_1 = require("appolo-inject");
exports.Injector = appolo_inject_1.Injector;
exports.singleton = appolo_inject_1.singleton;
exports.factory = appolo_inject_1.factory;
exports.inject = appolo_inject_1.inject;
exports.initMethod = appolo_inject_1.initMethod;
exports.injectParam = appolo_inject_1.injectParam;
exports.injectFactory = appolo_inject_1.injectFactory;
exports.injectFactoryMethod = appolo_inject_1.injectFactoryMethod;
exports.alias = appolo_inject_1.alias;
exports.aliasFactory = appolo_inject_1.aliasFactory;
exports.injectValue = appolo_inject_1.injectValue;
exports.injectObjectProperty = appolo_inject_1.injectObjectProperty;
exports.injectDictionary = appolo_inject_1.injectDictionary;
exports.injectArray = appolo_inject_1.injectArray;
exports.injectAlias = appolo_inject_1.injectAlias;
exports.lazy = appolo_inject_1.lazy;
exports.injectAliasFactory = appolo_inject_1.injectAliasFactory;
exports.define = appolo_inject_1.define;
exports.Define = appolo_inject_1.Define;
var app_2 = require("./lib/app");
exports.App = app_2.App;
var module_1 = require("./lib/modules/module");
exports.Module = module_1.Module;
var decorators_1 = require("./lib/decorators");
exports.mixins = decorators_1.mixins;
exports.bootstrap = decorators_1.bootstrap;
exports.module = decorators_1.module;
exports.create = function (options) {
    return new app_1.App(options);
};
//# sourceMappingURL=index.js.map