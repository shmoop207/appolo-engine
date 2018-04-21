"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
let should = require('chai').should();
const index_1 = require("../../index");
const manager2_1 = require("../mock/src/manager2");
const manager3_1 = require("../mock/src/manager3");
describe('define', function () {
    let app;
    beforeEach(async () => {
        app = index_1.createApp({
            root: process.cwd() + '/test/mock'
        });
        await app.launch();
    });
    afterEach(function () {
    });
    it('should define class static config', function () {
        let manager2 = app.injector.getObject(manager2_1.Manager2);
        should.exist(manager2);
        should.exist(manager2.manager);
        manager2.manager.run().should.be.ok;
    });
    it('should define class with linq', function () {
        let manager3 = app.injector.getObject(manager3_1.default);
        should.exist(manager3);
        should.exist(manager3.manager);
        manager3.manager.run().should.be.ok;
    });
    it('should define mixsins', function () {
        class Test {
            on(event, fn) {
                return true;
            }
            un(event, fn) {
                return true;
            }
        }
        let Test2 = class Test2 {
        };
        Test2 = tslib_1.__decorate([
            index_1.mixins(Test)
        ], Test2);
        let test = new Test2();
        test.on().should.be.ok;
    });
});
//# sourceMappingURL=define.js.map