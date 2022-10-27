"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sinon = require("sinon");
const sinonChai = require("sinon-chai");
const chai = require("chai");
const index_1 = require("../../index");
chai.use(sinonChai);
let should = chai.should();
describe('events', function () {
    let app;
    beforeEach(async () => {
        app = (0, index_1.createApp)({
            root: process.cwd() + '/test/mock'
        });
    });
    afterEach(function () {
    });
    it('should have  events', async function () {
        let spy = sinon.spy();
        app.event.onModuleExport.once(spy);
        app.event.beforeModuleInitialize.once(spy);
        app.event.afterModuleInitialize.once(spy);
        app.event.beforeModulesLoad.once(spy);
        app.event.afterModulesLoaded.once(spy);
        app.event.beforeInjectorInitialize.once(spy);
        app.event.afterInjectorInitialize.once(spy);
        app.event.beforeBootstrap.once(spy);
        app.event.afterBootstrap.once(spy);
        app.event.beforeInjectRegister.once(spy);
        app.event.onClassExport.once(spy);
        app.event.afterInjectRegister.once(spy);
        app.event.beforeReset.once(spy);
        app.event.afterReset.once(spy);
        await app.launch();
        await app.reset();
        app["resetTestEvent"].should.be.ok;
        app["resetTest"].should.be.ok;
        spy.should.callCount(14);
    });
});
//# sourceMappingURL=events.js.map