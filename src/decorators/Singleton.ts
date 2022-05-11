// Libs
import "reflect-metadata";

// Types
import { TClass } from "@common/types";

const key = Symbol("singleton decorator");

export const Singleton = <T extends TClass>(type: T): any => {
    return new Proxy(type, {
        construct(target: any, argsList, newTarget) {
            if (target.prototype !== newTarget.prototype) {
                return Reflect.construct(target, argsList, newTarget);
            }

            if (!target[key]) {
                // eslint-disable-next-line no-param-reassign
                target[key] = Reflect.construct(target, argsList, newTarget);
            }

            return target[key];
        }
    });
};
