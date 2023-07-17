"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectUnix = exports.connectOIDC = void 0;
const tslib_1 = require("tslib");
const axios_1 = tslib_1.__importDefault(require("axios"));
const isomorphic_ws_1 = require("isomorphic-ws");
const https_1 = require("https");
function connectOIDC(url, accessToken, refreshToken) {
    const reqClient = axios_1.default.create({
        httpsAgent: new https_1.Agent({ rejectUnauthorized: false })
    });
    reqClient.interceptors.request.use((request) => {
        request.headers.Authorization = `Bearer ${accessToken}`;
        request.headers["X-LXD-oidc"] = "true";
        request.baseURL = url + "/1.0";
        return request;
    });
    function openWebsocket(path) {
        var u = new URL(url);
        return new isomorphic_ws_1.WebSocket("wss://" + u.host + "/1.0" + path);
    }
    reqClient.interceptors.response.use((response) => tslib_1.__awaiter(this, void 0, void 0, function* () {
        return response;
    }), (error) => tslib_1.__awaiter(this, void 0, void 0, function* () {
        let err = error;
        throw err;
    }));
    //@ts-expect-error
    reqClient.ws = openWebsocket;
    return reqClient;
}
exports.connectOIDC = connectOIDC;
function connectUnix(socketPath) {
    const reqClient = axios_1.default.create({
        httpsAgent: new https_1.Agent({
            rejectUnauthorized: false,
        }),
        socketPath: socketPath,
    });
    reqClient.interceptors.request.use((request) => {
        request.baseURL = "/1.0";
        return request;
    });
    return reqClient;
}
exports.connectUnix = connectUnix;
