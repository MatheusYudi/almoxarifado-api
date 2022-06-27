import { EnumStatuses } from "@common/enums";

export interface IGetListParams {
    page: number;
    size: number;
    order: string | undefined;
    orderBy: "ASC" | "DESC" | undefined;
    status?: EnumStatuses | undefined;
    filters?: string[];
}
