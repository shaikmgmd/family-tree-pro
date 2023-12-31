import {statsUrl} from "../../config/urls";
import {backend} from "../../config";

export const getTotalViews = async () => (
    backend.get(statsUrl.GET_TOTAL_VIEWS)
)

export const getLast7DaysViews = async () => (
    backend.get(statsUrl.GET_LAST_7_DAYS)
)

export const getLast30DaysViews = async () => (
    backend.get(statsUrl.GET_LAST_30_DAYS)
)

export const getViewsPerDay = async () => (
    backend.get(statsUrl.GET_VIEWS_PER_DAY)
)

export const postRecordView = async (id) => (
    backend.post(statsUrl.POST_RECORD, id)
)