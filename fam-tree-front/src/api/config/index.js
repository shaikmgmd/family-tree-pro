import axios from "axios";

export const apiBase = "api";
export const backend = axios.create();
export const serverUrl = "http://localhost:8080";

const prepareUrl = (url) => (url?.startsWith('/') ? url.substring(1) : url);

backend.interceptors.request.use((config) => {
    if (config.skipInterceptor) {
        return config;
    }

    let token = null;
    const userStr = localStorage.getItem('userData');
    if (userStr) {
        const userObj = JSON.parse(userStr);
        token = userObj?.token;
        config.headers['Authorization'] = `Bearer ${token}`;
    }

    return {
        ...config,
        url: `${serverUrl}/${apiBase}/${prepareUrl(config.url ?? '')}`,
    };
});