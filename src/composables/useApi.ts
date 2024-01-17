import { IRequest, IRequestModel } from '@/types/api';
import useRequest from './helpers/useRequest';
import useResponse from './helpers/useResponse';

export default <T>(requestConstructor: IRequest, requestValues: IRequestModel | Record<string, unknown> = {}):
    Promise<{ status: string; isSuccess: boolean; data: any; errors: object; } | any> | any => {

    let response;
    let valuesKeys: Array<string> | Record<string, any> = requestValues ? Object.keys(requestValues) : {};

    // Shortcut for POST : If no 'params','query','body' keys in requestValues object, so it is 'body' object itself.
    if (valuesKeys.length && !valuesKeys.some((key: keyof IRequestModel) => ['path', 'params', 'query', 'body'].includes(key))) {
        const body = { ...requestValues };
        requestValues = {};
        requestValues.body = body;
    }

    const request = useRequest(requestConstructor, requestValues);
    console.log('►►►', request.method.toUpperCase(), request.path, requestConstructor, requestValues);

    if (request) {
        response = useResponse<T>({ method: request.method, path: request.path, exec: request.exec });
    } else {
        throw new Error('Something went wront with your API request.');
    }
    return response;
};
