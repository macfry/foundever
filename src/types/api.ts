import { AxiosStatic, InternalAxiosRequestConfig } from "axios";

export enum EMETHOD {
    GET = 'get',
    POST = 'post',
    PUT = 'put',
    UPDATE = 'update',
    DELETE = 'delete',
}

export interface IRequestBuilder<T> {
    method: EMETHOD;
    path: string;
    body: string;
    exec: () => Promise<T>;
}

export interface IQuery {
    api_key: {
        required: boolean;
        default: string;
    },
    page?: {
        required: boolean;
    },
    with_genres?: {
        required: boolean;
    }
}

export interface IRequestModel {
    path: null | string;
    params: Record<string, string>;
    query: IQuery | Record<string, string>;
    body: null | Record<string, string>;
    config: InternalAxiosRequestConfig | Record<string, string>;
}

export interface IRequest extends IRequestModel {
    api: AxiosStatic;
    method: EMETHOD;
}

export interface IResponseProps {
    method: EMETHOD;
    path: string;
    exec: any; // () => Promise<IResponse<T>>;
}

export interface IPaginationModel<D> {
    page: number;
    results: D,
    total_pages: number;
    total_results: number;
}

export interface IResponse<T> {
    status: number | string;
    data?: IPaginationModel<T> | null;
    isSuccess: boolean;
    errors?: any;
}
