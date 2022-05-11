// Library
import { Logger } from "@library/index";

// Config
import { dbConfig } from "@config/database";
import { swaggerConfig } from "@config/swagger";

// Utils
import { EnvUtils } from "@common/utils";

// Routes
import { UserController } from "@routes/modules/users/v1";

import { App } from "./App";

const app: App = new App({
    port: Number(process.env.PORT || 8080),
    controllers: [UserController],
    middlewares: [Logger.middleware],
    logger: new Logger(),
    swaggerOptions: EnvUtils.isDevelopment() ? swaggerConfig : undefined,
    dbConfig
});

app.start();
