import {backend} from "../../config";
import {treeUrl} from "../../config/urls";

export const getTreeByUserId = async (id) => (
    backend.get(treeUrl.GET_TREE_BY_USER_ID(id))
)

export const addUserOnTree = async (id, payload) => (
    backend.post(treeUrl.ADD_USER_ON_TREE(id), payload)
)

// Ajouter le back-end
export const addExistingUserOnTree = async (id, payload) => (
    backend.post(treeUrl.ADD_EXISTING_USER_ON_TREE(id), payload)
)

export const confirmRelationShip = async (confirmation) => (
    backend.post(treeUrl.CONFIRM_RELATIONSHIP(confirmation))
)