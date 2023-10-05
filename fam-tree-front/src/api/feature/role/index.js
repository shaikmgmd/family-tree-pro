import {backend} from "../../config";
import {roleUrl} from "../../config/urls";

export const addAdminById = async (id) => (
    backend.post(roleUrl.ADD_ADMIN_BY_ID(id))
)

export const removeAdminById = async (id) => (
    backend.post(roleUrl.REMOVE_ADMIN_BY_ID(id))
)
