// Libs
import "reflect-metadata";

// Enums
import { EnumDecorators, EnumMethods } from "@common/enums";

// Interfaces
import { IRouteDef } from "@common/interfaces";

const decorateRoute = (method: EnumMethods, path: string): MethodDecorator => {
    return (target: any, propertyKey: string | symbol): void => {
        if (!Reflect.hasMetadata(EnumDecorators.ROUTES, target.constructor)) {
            Reflect.defineMetadata(EnumDecorators.ROUTES, [], target.constructor);
        }

        const routes: IRouteDef[] = Reflect.getMetadata(EnumDecorators.ROUTES, target.constructor) as IRouteDef[];

        routes.push({
            requestMethod: method,
            path,
            methodName: propertyKey
        });

        Reflect.defineMetadata(EnumDecorators.ROUTES, routes, target.constructor);
    };
};

export const Get = (path = ""): MethodDecorator => decorateRoute(EnumMethods.GET, path);
export const Post = (path = ""): MethodDecorator => decorateRoute(EnumMethods.POST, path);
export const Put = (path = ""): MethodDecorator => decorateRoute(EnumMethods.PUT, path);
export const Patch = (path = ""): MethodDecorator => decorateRoute(EnumMethods.PATCH, path);
export const Delete = (path = ""): MethodDecorator => decorateRoute(EnumMethods.DELETE, path);
