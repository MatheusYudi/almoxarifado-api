// Libs
import "./paths";

// Middlewares
import { Logger } from "@middlewares/index";

// Config
import { dbConfig } from "@config/database";
import { swaggerConfig } from "@config/swagger";

// Routes
import { UserController } from "@routes/modules/users/v1";

import { App } from "./App";

const app: App = new App({
    port: Number(process.env.PORT || 8080),
    controllers: [UserController],
    middlewares: [Logger.middleware],
    logger: new Logger(),
    swaggerOptions: swaggerConfig,
    dbConfig
});

app.start();
