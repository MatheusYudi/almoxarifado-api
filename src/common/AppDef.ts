/* eslint-disable no-console */
// Decorators
import { Singleton } from "@decorators/index";

// Interfaces
import { ILogger } from "@common/interfaces";

@Singleton
export class AppDef {
    public logger: ILogger;

    constructor() {
        this.logger = {
            log: () => {
                console.warn("Not implemented");
            },
            error: () => {
                console.warn("Not implemented");
            },
            warning: () => {
                console.warn("Not implemented");
            }
        };
    }
}
