class ResultInfo {
    public page: number;
    public per_page: number;
    public total_pages: number;
    public count: number;
    public total_count: number;
}

export default class CloudflareApiResponse<T> {
    public result: T;
    public result_info: ResultInfo;
    public success: boolean;
    public errors: any[];
    public messages: any[];
}