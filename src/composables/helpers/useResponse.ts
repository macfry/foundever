import { IResponse, IPaginationModel, IResponseProps } from "@/types/api";
import { AxiosError, AxiosResponse } from "axios";

export default async function useResponse<T>({  method, path , exec }: IResponseProps): Promise<() => Promise<IResponse<T>>> {
    let response: IResponse<T> = {
        status: '???',
        isSuccess: false,
    };

    if (typeof exec === 'function') {
        return exec()
            .then((requestHTTP: AxiosResponse<IPaginationModel<T>>) => {
                if (typeof requestHTTP === 'object') {
                    if (!requestHTTP?.errors) {
                        response.status = requestHTTP.status || 200;
                        response.data = requestHTTP.data || requestHTTP;
                        response.isSuccess = true;
                    } else {
                        if (!requestHTTP.status) requestHTTP.status = 403;
                        response.errors = requestHTTP?.errors;
                        response.isSuccess = false;
                    }
                } else {
                    response.status = 200;
                    response.data = requestHTTP;
                    response.isSuccess = true;
                }
                console.log('◄◄◄',method.toUpperCase(), path, response);
                return response;
            })
            .catch((e: AxiosError) => {
                console.error(e);
                response.data = e?.response?.data as IPaginationModel<T> ?? null;
                response.status = e?.response?.status ?? 500;
                response.isSuccess = false;
                console.log(method.toUpperCase(), path, response);
                return response;
            });
    } else {
        console.error('Request function is not a function');
        return async () => response;
    }
}
