import { Request } from "express";

export interface GetBoardDataParams {
    filter?: string;
    page?: string;
}

export interface GetBoardDataRequest extends Request {
    params: GetBoardDataParams,
    userId?: string;
};

export interface GetBoardDataResponse {
    status: 'notfound' | 'error' | 'success';
    message?: string;
    data?: any;
}