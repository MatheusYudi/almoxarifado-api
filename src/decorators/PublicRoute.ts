// Libs
import "reflect-metadata";

// Enums
import { EnumDecorators } from "@common/enums";

export const PublicRoute = (): any => {
    return (target: any, propertyKey: string | symbol) => {
        const publicRoutes: Array<string | symbol> = Reflect.getMetadata(EnumDecorators.PUBLIC_ROUTES, target.constructor) || [];

        publicRoutes.push(propertyKey);

        Reflect.defineMetadata(EnumDecorators.PUBLIC_ROUTES, publicRoutes, target.constructor);
    };
};
