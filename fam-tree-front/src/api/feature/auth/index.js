import {backend} from "../../config";
import {authUrl} from "../../config/urls";

export const userLogin = async (payload) => (
    backend.post(authUrl.LOGIN, payload)
)

export const userLogout = async () => (
    backend.post(authUrl.LOGOUT)
)

export const userFirstLogin = async (payload) => (
    backend.post(authUrl.FIRST_LOGIN, payload)
)