// Libs
import swaggerJSDoc from "swagger-jsdoc";
import { ConnectionOptions } from "typeorm";

// Types
import { TClass } from "@common/types";

// Interfaces
import { ILogger } from "@common/interfaces";

export interface IAppConfig {
    controllers: TClass[];
    logger: ILogger;
    port: number;
    assets?: string[];
    dbConfig?: ConnectionOptions;
    middlewares?: { forEach: (arg0: (middleware: any) => void) => void };
    swaggerOptions?: swaggerJSDoc.OAS3Options;
}
