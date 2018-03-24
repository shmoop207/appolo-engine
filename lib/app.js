"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const launcher_1 = require("./launcher/launcher");
class App {
    constructor(options) {
        this._launcher = new launcher_1.Launcher();
        this._options = this._launcher.loadOptions(options);
        this._env = this._launcher.loadEnvironments();
        this._injector = this._launcher.loadInject();
        this._injector.addObject("app", this);
        this._moduleManager = this._launcher.createModuleManager();
    }
    static create(options) {
        return new App(options);
    }
    ;
    launch() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield this._launcher.launch();
            return this;
        });
    }
    get env() {
        return this._env;
    }
    get options() {
        return this._options;
    }
    get injector() {
        return this._injector;
    }
    module(moduleFn) {
        return this._moduleManager.load(moduleFn);
    }
}
exports.App = App;
//# sourceMappingURL=app.js.map