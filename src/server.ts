// Resolve paths
import "./paths";

// Middlewares
import { Logger } from "@middlewares/index";

// Config
import { dbConfig } from "@config/database";
import { swaggerConfig } from "@config/swagger";

// Routes
import { AuthController, UserController } from "@routes/modules";

// Utils
import { EnvUtils } from "@common/utils";

import { App } from "./App";

const app: App = new App({
    port: Number(process.env.PORT || 8080),
    controllers: [AuthController, UserController],
    middlewares: [Logger.middleware],
    logger: new Logger(),
    swaggerOptions: !EnvUtils.isProduction() ? swaggerConfig : undefined,
    dbConfig
});

app.start();
