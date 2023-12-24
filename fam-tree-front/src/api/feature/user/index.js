import {backend} from "../../config";
import {userUrl} from "../../config/urls";

export const getConnectedUser = async () => (
    backend.get(userUrl.GET_CONNECTED_USER)
)

export const updateUser = async (payload) => (
    backend.post(userUrl.UPDATE_USER, payload)
)

export const getAllUsersExceptCurrent = async (page, size) => (
    backend.get(userUrl.GET_ALL_USERS_EXCEPT_CURRENT(page, size))
)
