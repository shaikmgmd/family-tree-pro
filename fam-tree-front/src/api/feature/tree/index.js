import {backend} from "../../config";
import {treeUrl} from "../../config/urls";

export const getTreeByUserId = async (id) => (
    backend.get(treeUrl.GET_TREE_BY_USER_ID(id))
)

export const addUserOnTree = async (id, sourceMemberId, payload) => (
    backend.post(treeUrl.ADD_USER_ON_TREE(id, sourceMemberId), payload)
)

