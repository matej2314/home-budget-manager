import { type BaseApiResponse } from "@utils/asyncUtils/fetchData";

export type ReviewData = {
    content: string;
    rating: number;
};

export interface AddReviewResponse extends BaseApiResponse {
    id?: string;
};