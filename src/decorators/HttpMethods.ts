// Libs
import "reflect-metadata";

// Enums
import { EnumDecorators, EnumMethod } from "@common/enums";

// Interfaces
import { IRouteDef } from "@common/interfaces";

const decorateRoute = (method: EnumMethod, path: string): MethodDecorator => {
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

export const Get = (path = ""): MethodDecorator => decorateRoute(EnumMethod.GET, path);
export const Post = (path = ""): MethodDecorator => decorateRoute(EnumMethod.POST, path);
export const Put = (path = ""): MethodDecorator => decorateRoute(EnumMethod.PUT, path);
export const Patch = (path = ""): MethodDecorator => decorateRoute(EnumMethod.PATCH, path);
export const Delete = (path = ""): MethodDecorator => decorateRoute(EnumMethod.DELETE, path);
