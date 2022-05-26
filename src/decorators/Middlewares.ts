// Libs
import "reflect-metadata";

// Enums
import { EnumDecorators } from "@common/enums";

export const Middlewares = (...args: any[]): any => {
    return (target: any, propertyKey: string | symbol): void => {
        const middlewares: any = Reflect.getMetadata(EnumDecorators.MIDDLEWARE, target.constructor) || {};

        middlewares[propertyKey] = [];

        args.forEach(item => {
            const data: any[] = Array.isArray(item) ? item : [item];
            middlewares[propertyKey] = middlewares[propertyKey].concat(...data);
        });

        Reflect.defineMetadata(EnumDecorators.MIDDLEWARE, middlewares, target.constructor);
    };
};
