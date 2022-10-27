"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai = require("chai");
const bootstrap_1 = require("../mock/src/bootstrap");
const index_1 = require("../../index");
const testModule_1 = require("../mock/config/modules/test2/testModule");
let should = chai.should();
describe('bootstrap', function () {
    let app;
    beforeEach(async () => {
        app = (0, index_1.createApp)({
            root: process.cwd() + '/test/mock'
        });
        await app.module.use(testModule_1.Test2Module);
        await app.launch();
    });
    afterEach(function () {
        app.reset();
    });
    it('should have  call afterBootstrap initialize', function () {
        let bootstrap = app.injector.getObject(bootstrap_1.Bootstrap);
        let exportedClassEvent = app.injector.getObject("exportedClassEvent");
        let nestedProvider = app.injector.getObject("nestedProvider");
        should.exist(bootstrap);
        should.exist(bootstrap.manager);
        bootstrap.manager.run().should.be.ok;
        bootstrap.working.should.be.ok;
        exportedClassEvent.should.be.ok;
        nestedProvider.dbMock2.db.conn.should.be.eq("working");
    });
});
//# sourceMappingURL=bootstrap.js.map