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
        servers: [
            {
                description: "Development",
                url: "http://localhost:4444"
            },
            {
                description: "Staging",
                url: "https://almoxarifado-api-v1-staging.herokuapp.com"
            }
        ],
        components: {
            securitySchemes: {
                BearerAuth: {
                    in: "header",
                    type: "http",
                    scheme: "bearer"
                }
            }
        }
    },
    apis: [resolve(__dirname, "./references/**/*.{js,ts}"), resolve(__dirname, "../../routes/modules/**/*.{js,ts}")]
};
