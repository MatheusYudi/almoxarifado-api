// Libs
import "reflect-metadata";

// Enums
import { EnumDecorators } from "@common/enums";

export const Controller = (prefix = ""): ClassDecorator => {
    return (target: any) => {
        Reflect.defineMetadata(EnumDecorators.CONTROLLER_PREFIX, prefix, target);

        if (!Reflect.hasMetadata(EnumDecorators.ROUTES, target)) {
            Reflect.defineMetadata(EnumDecorators.ROUTES, [], target);
        }
    };
};
