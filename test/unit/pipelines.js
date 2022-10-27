"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const controller_1 = require("../mock/src/controller");
const utils_1 = require("@appolo/utils");
let should = require('chai').should();
const index_1 = require("../../index");
const manager_1 = require("../mock/src/manager");
const manager4_1 = require("../mock/src/manager/manager4");
describe('Pipeline', function () {
    let app;
    beforeEach(async () => {
        app = (0, index_1.createApp)({
            root: process.cwd() + '/test/mock'
        });
        await app.launch();
    });
    afterEach(async function () {
        await app.reset();
    });
    it('should call pipeline decorator', async function () {
        let controller = app.injector.getObject(controller_1.Controller);
        let result = await controller.pipelineTest([]);
        result.should.be.deep.equals([2, 3, 1]);
    });
    it('should call guard decorator', async function () {
        let manager = app.injector.getObject(manager_1.Manager);
        let result = await manager.testGuard(1, 2);
        result.should.be.deep.equals(3);
        let [err] = await utils_1.Promises.to(manager.testGuard(1, 4));
        err.message.should.be.eq("Forbidden resource");
    });
    it('should call interceptor decorator', async function () {
        let manager = app.injector.getObject(manager_1.Manager);
        let [err] = await utils_1.Promises.to(manager.testInterceptorTimeout(1, 2));
        err.message.should.be.eq("promise timeout");
    });
    it('should call interceptor decorator change after', async function () {
        let manager = app.injector.getObject(manager_1.Manager);
        let result = await manager.testInterceptorMultiValue(1, 2);
        result.should.be.eq(6);
    });
    it('should call pipe decorator', async function () {
        let manager = app.injector.getObject(manager_1.Manager);
        let result = await manager.testPipeMultiValue(1, 2);
        result.should.be.eq(4);
    });
    it('should call exception decorator', async function () {
        let manager = app.injector.getObject(manager_1.Manager);
        let result = await manager.testCatchError(1, 2);
        result.message.should.be.eq("some error");
    });
    it('should call pipe decorator on all class Methods', async function () {
        let manager = app.injector.getObject(manager4_1.default);
        let result = await manager.run(1);
        result.should.be.eq(2);
        let result2 = await manager.run2(5);
        result2.should.be.eq(10);
        let result3 = await manager._run3(3);
        result3.should.be.eq(3);
    });
    it('should call pipeline decorator in order params', async function () {
        let controller = app.injector.getObject(controller_1.Controller);
        let result = await controller.pipelineTest2([]);
        result.should.be.deep.equals([3, 2, 1]);
    });
    it('should call pipeline validate', async function () {
        let controller = app.injector.getObject(controller_1.Controller);
        let result = await controller.validateTest(6);
        result.should.be.eq(0);
        result = await controller.validateTest(5);
        result.should.be.eq(5);
    });
    it('should call pipeline on create', async function () {
        let manager = app.injector.getObject(manager_1.Manager);
        manager.onCreateTest.should.be.ok;
    });
    it('should call pipeline validate arguments', async function () {
        let controller = app.injector.getObject(controller_1.Controller);
        let result = await controller.validateTest2(5, 5);
        result.should.be.eq(10);
        result = await controller.validateTest2(6, 7);
        result.should.be.eq(0);
        result = await controller.validateTest2(5, 7);
        result.should.be.eq(5);
    });
    it('should call base class pipeline validate arguments', async function () {
        let controller = app.injector.getObject(controller_1.Controller);
        let result = await controller.validateBase(5, 5);
        result.should.be.eq(10);
        result = await controller.validateBase(6, 7);
        result.should.be.eq(0);
        result = await controller.validateBase(5, 7);
        result.should.be.eq(5);
    });
});
//# sourceMappingURL=pipelines.js.map