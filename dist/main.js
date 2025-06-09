"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("tsconfig-paths/register");
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const swagger_1 = require("@nestjs/swagger");
async function bootstrap() {
    try {
        const app = await core_1.NestFactory.create(app_module_1.AppModule);
        app.enableCors({
            origin: '*',
            credentials: true,
        });
        const config = new swagger_1.DocumentBuilder()
            .setTitle('Todo App')
            .setDescription('API docs for your NestJS ToDo app')
            .setVersion('1.0')
            .addBearerAuth()
            .build();
        swagger_1.SwaggerModule.setup('api', app, swagger_1.SwaggerModule.createDocument(app, config));
        const port = process.env.PORT || 3000;
        await app.listen(port, '0.0.0.0');
    }
    catch (error) {
        process.exit(1);
    }
}
bootstrap();
//# sourceMappingURL=main.js.map