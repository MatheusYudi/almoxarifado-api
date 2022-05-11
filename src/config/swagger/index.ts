// Libs
import swaggerJSDoc from "swagger-jsdoc";

export const swaggerConfig: swaggerJSDoc.OAS3Options = {
    swaggerDefinition: {
        openapi: "3.0.0",
        info: {
            title: "Almoxarifado API",
            version: "0.1.0"
        },
        host: "localhost:4444"
    },
    apis: ["src/library/third-party/swagger/**/*.ts", "src/routes/modules/**/*.ts"]
};
