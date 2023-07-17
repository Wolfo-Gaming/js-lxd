import { Issuer } from 'openid-client';
import { Axios, AxiosError, AxiosInstance } from "axios";
import axios from "axios"
import { WebSocket } from "isomorphic-ws"
export type StatusCode = 100 | 101 | 102 | 103 | 104 | 105 | 106 | 107 | 108 | 109 | 110 | 111 | 112 | 113 | 200 | 400 | 401;
export interface ResponseRaw {
    type: ResponseType;
    status: string;
    status_code: StatusCode;
    operation: string;
    error_code: number;
    error: string;
    metadata: any;
}
import { Agent } from "https"

export function connectOIDC(url: string, accessToken: string, refreshToken?: string): AxiosInstance & { ws: (url: string) => WebSocket } {
    const reqClient = axios.create({
        httpsAgent: new Agent({rejectUnauthorized:false})
    })

    reqClient.interceptors.request.use((request) => {
        request.headers.Authorization = `Bearer ${accessToken}`;
        request.headers["X-LXD-oidc"] = "true";
        request.baseURL = url + "/1.0";
        return request;
    })
    function openWebsocket(path: string) {
        var u = new URL(url)
        return new WebSocket("wss://" + u.host + "/1.0" + path)
    }
    reqClient.interceptors.response.use(async (response) => {
        return response;
    }, async (error) => {
        let err = error as AxiosError<ResponseRaw, Axios>
        throw err;
    })
    //@ts-expect-error
    reqClient.ws = openWebsocket;
    return (reqClient as any);
}

export function connectUnix(socketPath: string) {
    const reqClient = axios.create({
        httpsAgent: new Agent({
            rejectUnauthorized: false,
        }),
        socketPath: socketPath,
    })
    reqClient.interceptors.request.use((request) => {
        request.baseURL = "/1.0";
        return request;
    })
    return reqClient;
}
