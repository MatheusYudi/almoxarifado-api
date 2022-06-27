// Enums
import { EnumMethods } from "@common/enums";

export interface IRouteDef {
    path: string;
    requestMethod: EnumMethods;
    methodName: string | symbol;
}
