import {backend} from "../../config";
import {adhesionUrl} from "../../config/urls";

export const createAdhesion = async (payload) => (
    backend.post(adhesionUrl.CREATE_ADHESION, payload)
)

export const approveAdhesion = async (id) => (
    backend.post(adhesionUrl.APPROVE_ADHESION(id))
)

export const rejectAdhesion = async (id) => (
    backend.post(adhesionUrl.REJECT_ADHESION(id))
)

export const getAdhesionsByStatus = async (params) => (
    backend.get(adhesionUrl.GET_ADHESIONS_BY_STATUS, params)
)
export const getPendingAdhesions = async () => (
    backend.get(adhesionUrl.GET_PENDING_ADHESIONS)
)

export const getApprovedAdhesions = async () => (
    backend.get(adhesionUrl.GET_APPROVED_ADHESIONS)
)