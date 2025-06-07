"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const core_1 = require("@nestjs/core");
const app_module_1 = require("../app.module");
const platform_express_1 = require("@nestjs/platform-express");
const serverless_http_1 = require("serverless-http");
const express_1 = require("express");
const expressApp = (0, express_1.default)();
let cachedServer;
async function bootstrap() {
    if (!cachedServer) {
        const app = await core_1.NestFactory.create(app_module_1.AppModule, new platform_express_1.ExpressAdapter(expressApp));
        app.enableCors();
        await app.init();
        cachedServer = (0, serverless_http_1.default)(expressApp);
    }
    return cachedServer;
}
const handler = async (req, res) => {
    const server = await bootstrap();
    return server(req, res);
};
exports.handler = handler;
//# sourceMappingURL=graphql.js.map