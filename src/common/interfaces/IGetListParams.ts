export interface IGetListParams {
    size: number;
    page: number;
    order: string | undefined;
    orderBy: "ASC" | "DESC" | undefined;
    filters?: string[];
}
