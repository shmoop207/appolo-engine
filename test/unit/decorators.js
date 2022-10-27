"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const chai = require("chai");
const utils_1 = require("@appolo/utils");
const helpers_1 = require("@appolo/helpers");
let should = chai.should();
describe("decorator", function () {
    it('should call throttle', async () => {
        class Test {
            constructor() {
                this.test = 0;
            }
            handle() {
                return ++this.test;
            }
        }
        tslib_1.__decorate([
            (0, helpers_1.throttle)(10),
            tslib_1.__metadata("design:type", Function),
            tslib_1.__metadata("design:paramtypes", []),
            tslib_1.__metadata("design:returntype", void 0)
        ], Test.prototype, "handle", null);
        let test = new Test();
        test.handle();
        test.handle();
        test.handle();
        await utils_1.Promises.delay(11);
        test.test.should.be.eq(1);
    });
    it('should call debounce', async () => {
        class Test {
            constructor() {
                this.test = 0;
            }
            handle() {
                return ++this.test;
            }
        }
        tslib_1.__decorate([
            (0, helpers_1.debounce)(10),
            tslib_1.__metadata("design:type", Function),
            tslib_1.__metadata("design:paramtypes", []),
            tslib_1.__metadata("design:returntype", void 0)
        ], Test.prototype, "handle", null);
        let test = new Test();
        test.handle();
        test.handle();
        test.handle();
        await utils_1.Promises.delay(5);
        test.test.should.be.eq(0);
        await utils_1.Promises.delay(11);
        test.test.should.be.eq(1);
    });
    it('should call bind', async () => {
        class Test {
            constructor() {
                this.test = "test";
            }
            handle() {
                return this.test;
            }
        }
        tslib_1.__decorate([
            helpers_1.bind,
            tslib_1.__metadata("design:type", Function),
            tslib_1.__metadata("design:paramtypes", []),
            tslib_1.__metadata("design:returntype", void 0)
        ], Test.prototype, "handle", null);
        let test = new Test();
        test.handle.call(null).should.be.eq("test");
    });
    it('should call delay', async () => {
        class Test {
            constructor() {
                this.test = 0;
            }
            handle() {
                return ++this.test;
            }
        }
        tslib_1.__decorate([
            (0, helpers_1.delay)(10),
            tslib_1.__metadata("design:type", Function),
            tslib_1.__metadata("design:paramtypes", []),
            tslib_1.__metadata("design:returntype", void 0)
        ], Test.prototype, "handle", null);
        let test = new Test();
        test.handle();
        await utils_1.Promises.delay(5);
        test.test.should.be.eq(0);
        await utils_1.Promises.delay(11);
        test.test.should.be.eq(1);
    });
    it('should call cache', async () => {
        class Test {
            constructor() {
                this.test = 0;
            }
            handle() {
                return ++this.test;
            }
        }
        tslib_1.__decorate([
            (0, helpers_1.cache)(),
            tslib_1.__metadata("design:type", Function),
            tslib_1.__metadata("design:paramtypes", []),
            tslib_1.__metadata("design:returntype", void 0)
        ], Test.prototype, "handle", null);
        let test = new Test();
        test.handle();
        test.handle();
        test.handle();
        test.test.should.be.eq(1);
    });
    it('should call async cache', async () => {
        class Test {
            constructor() {
                this.test = 0;
            }
            async handle() {
                return ++this.test;
            }
        }
        tslib_1.__decorate([
            (0, helpers_1.cache)(),
            tslib_1.__metadata("design:type", Function),
            tslib_1.__metadata("design:paramtypes", []),
            tslib_1.__metadata("design:returntype", Promise)
        ], Test.prototype, "handle", null);
        let test = new Test();
        await test.handle();
        await test.handle();
        await test.handle();
        test.test.should.be.eq(1);
    });
    it('should call async cache with expire', async () => {
        class Test {
            constructor() {
                this.test = 0;
            }
            async handle() {
                return ++this.test;
            }
        }
        tslib_1.__decorate([
            (0, helpers_1.cache)({ refresh: true, maxAge: 20 }),
            tslib_1.__metadata("design:type", Function),
            tslib_1.__metadata("design:paramtypes", []),
            tslib_1.__metadata("design:returntype", Promise)
        ], Test.prototype, "handle", null);
        let test = new Test();
        await test.handle();
        await utils_1.Promises.delay(12);
        await test.handle();
        await test.handle();
        test.test.should.be.eq(2);
    });
    it('should call once', async () => {
        class Test {
            constructor() {
                this.test = 0;
                this.test2 = 0;
            }
            handle() {
                return ++this.test;
            }
            handle2() {
                return ++this.test2;
            }
        }
        tslib_1.__decorate([
            (0, helpers_1.once)(),
            tslib_1.__metadata("design:type", Function),
            tslib_1.__metadata("design:paramtypes", []),
            tslib_1.__metadata("design:returntype", void 0)
        ], Test.prototype, "handle", null);
        tslib_1.__decorate([
            (0, helpers_1.once)(2),
            tslib_1.__metadata("design:type", Function),
            tslib_1.__metadata("design:paramtypes", []),
            tslib_1.__metadata("design:returntype", void 0)
        ], Test.prototype, "handle2", null);
        let test = new Test();
        test.handle();
        test.handle();
        test.handle();
        test.handle2();
        test.handle2();
        test.handle2();
        test.test.should.be.eq(1);
        test.test2.should.be.eq(2);
    });
});
//# sourceMappingURL=decorators.js.map