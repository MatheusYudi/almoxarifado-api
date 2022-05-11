// Libs
import { ConnectionOptions } from "typeorm";
import { MysqlConnectionOptions } from "typeorm/driver/mysql/MysqlConnectionOptions";

// Utils
import EnvUtils from "@common/utils/EnvUtils";

// Opções genéricas
const baseOptions: Omit<ConnectionOptions, "type"> = {
    name: "almoxarifado-api", // Nome da conexão
    database: "almoxarifado-database", // Nome do banco
    entities: ["src/library/database/entity/**/*.ts", "library/database/entity/**/*.js"], // Local das entidades
    migrations: ["migrations/seeds/*.ts"], // Local das migrations
    cli: {
        migrationsDir: "migrations/seeds"
    },
    migrationsRun: EnvUtils.isDevelopment(), // Habilita execução das migrations
    logging: EnvUtils.isDevelopment(), // Habilita logs
    synchronize: true
};

// Opções para conexão com MySql
const mysqlOptions: MysqlConnectionOptions = {
    type: "mysql",
    url: process.env.MYSQL_CONNECTION_URL,
    logging: false // Habilitar para visualizar as queries do banco
};

export const dbConfig = {
    ...baseOptions,
    ...mysqlOptions
} as ConnectionOptions;
