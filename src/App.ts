// Libs
import { ConnectionOptions } from "typeorm";
import compression from "compression";
import cors from "cors";
import express, { Application } from "express";
import fileMiddleware from "express-multipart-file-parser";
import helmet from "helmet";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUI from "swagger-ui-express";

// Routes
import { RoutesController, RouteResponse } from "@routes/index";

// Interfaces
import { IAppConfig } from "@common/interfaces";

// Library
import { Database } from "@library/index";

// Common
import { AppDef } from "@common/AppDef";

// Types
import { TClass } from "@common/types";

/**
 * App
 *
 * Classe principal responsável por gerenciar o express
 */
export class App {
    public app: Application;

    private appDef: AppDef;

    private dbConfig: ConnectionOptions | undefined;

    private port: number;

    constructor(config: IAppConfig) {
        this.app = express();
        this.appDef = new AppDef();
        this.port = config.port;
        this.dbConfig = config.dbConfig;
        this.appDef.logger = config.logger;

        this.setMiddlewares(config.middlewares);
        this.setRoutes(config.controllers);
        this.configSwagger(config.swaggerOptions);
        this.setExtraMiddlewares();
    }

    /**
     * start
     *
     * Inicia o servidor baseado no arquivo de configuração `express.listener()`
     */
    public start(): void {
        this.app.listen(this.port, async () => {
            this.configDatabase();
            this.appDef.logger.log(`App listening NODE_ENV: ${process.env.NODE_ENV}`);
        });
    }

    /**
     * setMiddlewares
     *
     * Seta os interceptors para o express
     *
     * @param middlewares - Lista de middlewares
     */
    private setMiddlewares(middlewares: { forEach: (arg0: (middleware: any) => void) => void } | undefined): void {
        this.app.use(helmet()); // Blinda os modos mais básicos de segurança
        this.app.use(express.json({ limit: "50mb" })); // Converte o body do request para objeto
        this.app.use(express.urlencoded({ limit: "50mb", extended: true }));
        this.app.use(cors({ origin: true })); // Automaticamente habilita cross-origin requests
        this.app.use(compression()); // Compressão GZIP
        this.app.use(fileMiddleware); // Trata arquivos enviados para rota e adiciona no express.req

        // Middlewares externos
        if (middlewares) {
            middlewares.forEach(middleware => this.app.use(middleware));
        }
    }

    /**
     * setRoutes
     *
     * Seta todos os controllers que vão ser exportados
     *
     * @param controllers - Lista de controllers
     */
    private setRoutes(controllers: TClass[]): void {
        this.app.use(RoutesController.exportRoutes(controllers));
    }

    /**
     * setExtraMiddlewares
     *
     * Seta as rotas e middlewares executados após a criação de rotas
     */
    private setExtraMiddlewares(): void {
        this.app.use("*", (req: express.Request, res: express.Response) => RouteResponse.notFound(req, res));
        this.app.use(RouteResponse.serverError);
    }

    /**
     * configDatabase
     *
     * Adiciona as configurações do banco de dados e inicia o TypeORM
     */
    private configDatabase(): void {
        if (this.dbConfig) {
            Database.connect(this.dbConfig)
                .then(() => this.appDef.logger.log("Database connected"))
                .catch(error => this.appDef.logger.error(`DatabaseError: ${error}`));
        }
    }

    /**
     * configSwagger
     *
     * Percorre o arquivo de configuração e gera a documentação na api
     *
     * @param options - Opções do swagger
     */
    private configSwagger(options: swaggerJSDoc.OAS3Options | undefined): void {
        if (options) {
            this.app.use("/swagger", swaggerUI.serve, swaggerUI.setup(swaggerJSDoc(options)));
            this.appDef.logger.log("Swagger listening on /swagger");
        }
    }
}
