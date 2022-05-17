// Libs
import swaggerJSDoc from "swagger-jsdoc";

import packageJson from "../../../package.json";

export const swaggerConfig: swaggerJSDoc.OAS3Options = {
    swaggerDefinition: {
        openapi: "3.0.0",
        info: {
            title: packageJson.description,
            version: packageJson.version
        },
        host: "localhost:4444"
    },
    apis: ["src/config/swagger/references/*.ts", "src/routes/modules/**/*.ts"]
};
