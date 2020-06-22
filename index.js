"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./lib/app");
const appolo_inject_1 = require("appolo-inject");
exports.alias = appolo_inject_1.alias;
exports.aliasFactory = appolo_inject_1.aliasFactory;
exports.define = appolo_inject_1.define;
exports.Define = appolo_inject_1.Define;
exports.factory = appolo_inject_1.factory;
exports.initMethod = appolo_inject_1.initMethod;
exports.inject = appolo_inject_1.inject;
exports.injectAlias = appolo_inject_1.injectAlias;
exports.injectAliasFactory = appolo_inject_1.injectAliasFactory;
exports.injectArray = appolo_inject_1.injectArray;
exports.injectDictionary = appolo_inject_1.injectDictionary;
exports.injectFactory = appolo_inject_1.injectFactory;
exports.injectFactoryMethod = appolo_inject_1.injectFactoryMethod;
exports.injectLazy = appolo_inject_1.injectLazy;
exports.injectObjectProperty = appolo_inject_1.injectObjectProperty;
exports.Injector = appolo_inject_1.Injector;
exports.injectParam = appolo_inject_1.injectParam;
exports.injectValue = appolo_inject_1.injectValue;
exports.lazy = appolo_inject_1.lazy;
exports.override = appolo_inject_1.override;
exports.singleton = appolo_inject_1.singleton;
exports.dynamicFactory = appolo_inject_1.dynamicFactory;
exports.customInjectFn = appolo_inject_1.customInjectFn;
exports.initMethodAsync = appolo_inject_1.initMethodAsync;
exports.customParam = appolo_inject_1.customParam;
var util_1 = require("./lib/util/util");
exports.Util = util_1.Util;
var appolo_event_dispatcher_1 = require("appolo-event-dispatcher");
exports.EventDispatcher = appolo_event_dispatcher_1.EventDispatcher;
var launcher_1 = require("./lib/launcher/launcher");
exports.Launcher = launcher_1.Launcher;
var filesLoader_1 = require("./lib/loader/filesLoader");
exports.FilesLoader = filesLoader_1.FilesLoader;
var app_2 = require("./lib/app");
exports.App = app_2.App;
var module_1 = require("./lib/modules/module");
exports.Module = module_1.Module;
var events_1 = require("./lib/interfaces/events");
exports.Events = events_1.Events;
var pipelineContext_1 = require("./lib/pipelines/pipelineContext");
exports.PipelineContext = pipelineContext_1.PipelineContext;
var decorators_1 = require("./lib/decoretors/decorators");
exports.mixins = decorators_1.mixins;
exports.bootstrap = decorators_1.bootstrap;
exports.module = decorators_1.module;
exports.throttle = decorators_1.throttle;
exports.bind = decorators_1.bind;
exports.delay = decorators_1.delay;
exports.debounce = decorators_1.debounce;
exports.cache = decorators_1.cache;
exports.once = decorators_1.once;
exports.interval = decorators_1.interval;
exports.before = decorators_1.before;
exports.after = decorators_1.after;
exports.pipeline = decorators_1.pipeline;
exports.pipelineInstance = decorators_1.pipelineInstance;
exports.pipelineType = decorators_1.pipelineType;
exports.createApp = function (options) {
    return new app_1.App(options);
};
//# sourceMappingURL=index.js.map