"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const users_resolver_1 = require("./users.resolver");
describe('UsersResolver', () => {
    let resolver;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [users_resolver_1.UsersResolver],
        }).compile();
        resolver = module.get(users_resolver_1.UsersResolver);
    });
    it('should be defined', () => {
        expect(resolver).toBeDefined();
    });
});
//# sourceMappingURL=users.resolver.spec.js.map