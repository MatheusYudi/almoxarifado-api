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
                // empty
            },
            error: () => {
                // empty
            },
            warning: () => {
                // empty
            }
        };
    }
}
