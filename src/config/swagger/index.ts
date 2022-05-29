// Libs
import { OAS3Options } from "swagger-jsdoc";
import { resolve } from "path";

export const swaggerConfig: OAS3Options = {
    swaggerDefinition: {
        openapi: "3.0.0",
        info: {
            title: "Almoxarifado API",
            version: "0.1.0"
        },
        components: {
            securitySchemes: {
                BearerAuth: {
                    in: "header",
                    type: "http",
                    scheme: "bearer"
                }
            }
        },
        tags: [{ name: "Auth" }, { name: "Access Groups" }, { name: "Users" }]
    },
    apis: [resolve(__dirname, "./references/**/*.{js,ts}"), resolve(__dirname, "../../routes/modules/**/*.{js,ts}")]
};
