export type PaginatedResponse<T> = {
    items: T[];
    total: number;
    page: number | null;
    pageSize: number | null;
};