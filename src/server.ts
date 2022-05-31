// Resolve paths
import "./paths";

// Middlewares
import { Logger } from "@middlewares/index";

// Config
import { dbConfig } from "@config/database";
import { swaggerConfig } from "@config/swagger";

// Routes
import {
    AuthController,
    AccessGroupController,
    UserController,
    // InventoryControl
    // InvoiceController,
    MaterialController,
    MaterialGroupController,
    MovementController,
    // RequisitionController,
    SupplierController
} from "@routes/modules";

// Utils
import { EnvUtils } from "@common/utils";

import { App } from "./App";

const app: App = new App({
    port: Number(process.env.PORT || 8080),
    controllers: [
        AuthController,
        AccessGroupController,
        UserController,
        // InventoryController,
        // InvoiceController,
        MaterialController,
        MaterialGroupController,
        MovementController,
        // RequisitionController,
        SupplierController
    ],
    middlewares: [Logger.middleware],
    logger: new Logger(),
    swaggerOptions: !EnvUtils.isProduction() ? swaggerConfig : undefined,
    dbConfig
});

app.start();
