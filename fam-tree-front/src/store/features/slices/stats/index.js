import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {
    getLast30DaysViews,
    getViewsPerDay,
    getLast7DaysViews,
    getTotalViews,
    postRecordView
} from "../../../../api/feature/stats";
import {confirmRelationshipAction, getTreeByUserIdAction} from "../tree";


export const getLast30DaysViewsAction = createAsyncThunk('get-30-days', async () => {
    const response = await getLast30DaysViews();
    console.log(response);
    return response.data.content;
});

export const getLast7DaysViewsAction = createAsyncThunk('get-7-days', async () => {
    const response = await getLast7DaysViews();
    console.log(response);
    return response.data.content;
});

export const getTotalViewsAction = createAsyncThunk('get-total-views', async () => {
    const response = await getTotalViews();
    console.log(response);
    return response.data.content;
});

export const getViewsPerDayAction = createAsyncThunk('get-views-per-day', async () => {
    const response = await getViewsPerDay();
    console.log(response);
    return response.data.content;
});

export const postRecordViewAction = createAsyncThunk('post-record', async (id) => {
    const data = new FormData();
    data.append('treeId',id);
    const response = await postRecordView(data);
    console.log(response);
    return response.data.content;
});

const initialState = {
    last7DaysViews: {
        loading: null,
        payload: null,
        errors: null
    },
    last30DaysViews: {
        loading: null,
        payload: null,
        errors: null
    },
    totalViews: {
        loading: null,
        payload: null,
        errors: null
    },
    viewsPerDay: {
        loading: null,
        payload: null,
        errors: null
    },
    postRecord: {
        loading: null,
        payload: null,
        errors: null
    },
}

const statsStore = createSlice({
    name: 'stats',
    initialState,
    reducers: {},
    extraReducers(builder) {
        builder

            // getLast7DaysViewsAction
            .addCase(getLast7DaysViewsAction.pending, (state) => {
                state.last7DaysViews.loading = true;
                state.last7DaysViews.errors = undefined;
            })
            .addCase(getLast7DaysViewsAction.fulfilled, (state, action) => {
                state.last7DaysViews.loading = false;
                state.last7DaysViews.payload = action.payload;
                state.last7DaysViews.errors = undefined;
            })
            .addCase(getLast7DaysViewsAction.rejected, (state, action) => {
                state.last7DaysViews.loading = false;
                state.last7DaysViews.errors = action.errors; // très important
            })
            // getLast30DaysViewsAction
            .addCase(getLast30DaysViewsAction.pending, (state) => {
                state.last30DaysViews.loading = true;
                state.last30DaysViews.errors = undefined;
            })
            .addCase(getLast30DaysViewsAction.fulfilled, (state, action) => {
                state.last30DaysViews.loading = false;
                state.last30DaysViews.payload = action.payload;
                state.last30DaysViews.errors = undefined;
            })
            .addCase(getLast30DaysViewsAction.rejected, (state, action) => {
                state.last30DaysViews.loading = false;
                state.last30DaysViews.errors = undefined;
            })
            // getTotalViewsAction
            .addCase(getTotalViewsAction.pending, (state) => {
                state.totalViews.loading = true;
                state.totalViews.errors = undefined;
            })
            .addCase(getTotalViewsAction.fulfilled, (state, action) => {
                state.totalViews.loading = false;
                state.totalViews.payload = action.payload;
                state.totalViews.errors = undefined;
            })
            .addCase(getTotalViewsAction.rejected, (state, action) => {
                state.totalViews.loading = false;
                state.totalViews.errors = undefined;
            })
            // getViewsPerDayAction
            .addCase(getViewsPerDayAction.pending, (state) => {
                state.viewsPerDay.loading = true;
                state.viewsPerDay.errors = undefined;
            })
            .addCase(getViewsPerDayAction.fulfilled, (state, action) => {
                state.viewsPerDay.loading = false;
                state.viewsPerDay.payload = action.payload;
                state.viewsPerDay.errors = undefined;
            })
            .addCase(getViewsPerDayAction.rejected, (state, action) => {
                state.viewsPerDay.loading = false;
                state.viewsPerDay.errors = undefined;
            })
    }
})

export default statsStore.reducer;