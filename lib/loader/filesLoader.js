"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FilesLoader = void 0;
const tslib_1 = require("tslib");
const fs = require("fs");
const path = require("path");
const utils_1 = require("@appolo/utils");
class FilesLoader {
    static load(root, filesPath) {
        return tslib_1.__asyncGenerator(this, arguments, function* load_1() {
            var _a, e_1, _b, _c;
            if (!Array.isArray(filesPath)) {
                filesPath = [filesPath];
            }
            try {
                for (var _d = true, filesPath_1 = tslib_1.__asyncValues(filesPath), filesPath_1_1; filesPath_1_1 = yield tslib_1.__await(filesPath_1.next()), _a = filesPath_1_1.done, !_a;) {
                    _c = filesPath_1_1.value;
                    _d = false;
                    try {
                        let filePath = _c;
                        yield tslib_1.__await(yield* tslib_1.__asyncDelegator(tslib_1.__asyncValues(this._walk(path.join(root, filePath)))));
                    }
                    finally {
                        _d = true;
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (!_d && !_a && (_b = filesPath_1.return)) yield tslib_1.__await(_b.call(filesPath_1));
                }
                finally { if (e_1) throw e_1.error; }
            }
        });
    }
    static _walk(dir) {
        return tslib_1.__asyncGenerator(this, arguments, function* _walk_1() {
            var _a, e_2, _b, _c;
            let [err, dirs] = yield tslib_1.__await(utils_1.Promises.to(fs.promises.readdir(dir)));
            if (err) {
                return yield tslib_1.__await(void 0);
            }
            try {
                for (var _d = true, dirs_1 = tslib_1.__asyncValues(dirs), dirs_1_1; dirs_1_1 = yield tslib_1.__await(dirs_1.next()), _a = dirs_1_1.done, !_a;) {
                    _c = dirs_1_1.value;
                    _d = false;
                    try {
                        const d = _c;
                        const file = path.join(dir, d);
                        let stat = yield tslib_1.__await(fs.promises.stat(file));
                        if (stat.isDirectory() && !file.startsWith("~")) {
                            yield tslib_1.__await(yield* tslib_1.__asyncDelegator(tslib_1.__asyncValues(yield tslib_1.__await(this._walk(file)))));
                        }
                        else if (stat.isFile() && file.endsWith(".js") && !file.startsWith("~")) {
                            yield yield tslib_1.__await(file);
                        }
                    }
                    finally {
                        _d = true;
                    }
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (!_d && !_a && (_b = dirs_1.return)) yield tslib_1.__await(_b.call(dirs_1));
                }
                finally { if (e_2) throw e_2.error; }
            }
        });
    }
}
exports.FilesLoader = FilesLoader;
//# sourceMappingURL=filesLoader.js.map