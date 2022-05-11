// Enums
import { EnumMethod } from "@common/enums";

export interface IRouteDef {
    path: string;
    requestMethod: EnumMethod;
    methodName: string | symbol;
}
