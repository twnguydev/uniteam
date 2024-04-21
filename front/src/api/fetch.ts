import axios, { AxiosResponse, AxiosError, AxiosRequestConfig } from 'axios';

const BASE_URL = 'http://localhost:8000';

interface ApiResponse<T> {
    access_token?: string;
    success: boolean;
    data?: T;
    error?: string;
}

const handleError = (error: AxiosError): ApiResponse<any> => {
    const status = error.response?.status;
    const data = error.response?.data;
    return { success: false, error: `${status}: ${data}`, access_token: undefined };
};

const handleResponse = <T>(response: AxiosResponse<T>): ApiResponse<any> => {
    return { success: true, data: response.data };
};

const fetchApi = async <T>(
    method: string,
    path: string,
    data?: any,
    config?: AxiosRequestConfig
): Promise<ApiResponse<T>> => {
    try {
        const headers = {
            'Access-Control-Allow-Origin': '*',
            ...config?.headers,
        };
        const response: AxiosResponse<T> = await axios.request<T>({
            method,
            url: `${BASE_URL}/${path}`,
            data,
            headers,
            ...config,
        });
        return handleResponse<T>(response);
    } catch (error) {
        console.log(error);
        return handleError(error as AxiosError<unknown, any>);
    }
};

export default fetchApi;