import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {
    approveAdhesion,
    createAdhesion, getAdhesionsByStatus,
    getApprovedAdhesions,
    getPendingAdhesions,
    rejectAdhesion
} from '../../../../api/feature/adhesion'

export const createAdhesionAction = createAsyncThunk('create-adhesion', async ({payload}) => {
        const response = await createAdhesion(payload);
        return response.data.content;
    }
);

export const getPendingAdhesionAction = createAsyncThunk('get-pending-adhesions', async () => {
    const response = await getAdhesionsByStatus({params: {status: "PENDING"}});
    return response.data.content;
});

export const getApprovedAdhesionAction = createAsyncThunk('get-approved-adhesions', async () => {
    const response = await getAdhesionsByStatus({params: {status: "APPROVED"}});
    return response.data.content;
});

export const getRejectedAdhesionAction = createAsyncThunk('get-rejected-adhesions', async () => {
    const response = await getAdhesionsByStatus({params: {status: "REJECTED"}});
    return response.data.content;
});


export const approveAdhesionAction = createAsyncThunk('approve-adhesion', async (id) => {
    const response = await approveAdhesion(id);
    return response.data.content;
});

export const rejectAdhesionAction = createAsyncThunk('reject-adhesion', async (id) => {
    const response = await rejectAdhesion(id);
    return response.data.content;
});


const initialState = {
    createAdhesion: {
        loading: false,
        payload: null,
        errors: null,
    },
    pendingAdhesions: {
        loading: false,
        payload: null,
        errors: null,
    },
    approvedAdhesions: {
        loading: false,
        payload: null,
        errors: null,
    },
    rejectedAdhesions: {
        loading: false,
        payload: null,
        errors: null,
    },
}

const adhesionsStore = createSlice({
    name: 'adhesion',
    initialState,
    reducers: {},
    extraReducers(builder) {
        builder
            .addCase(createAdhesionAction.pending, (state) => {
                state.createAdhesion.loading = true;
                state.createAdhesion.errors = undefined;
            })
            .addCase(createAdhesionAction.fulfilled, (state, action) => {
                state.createAdhesion.loading = false;
                state.createAdhesion.payload = action.payload;
                state.createAdhesion.errors = undefined;
            })
            .addCase(createAdhesionAction.rejected, (state, action) => {
                state.createAdhesion.loading = false;
                state.createAdhesion.errors = undefined;
            })
            // PENDING ADHESIONS
            .addCase(getPendingAdhesionAction.pending, (state) => {
                state.pendingAdhesions.loading = true;
                state.pendingAdhesions.errors = undefined;
            })
            .addCase(getPendingAdhesionAction.fulfilled, (state, action) => {
                state.pendingAdhesions.loading = false;
                state.pendingAdhesions.payload = action.payload;
                state.pendingAdhesions.errors = undefined;
            })
            .addCase(getPendingAdhesionAction.rejected, (state, action) => {
                state.pendingAdhesions.loading = false;
                state.pendingAdhesions.errors = undefined;
            })
            // APPROVED ADHESIONS
            .addCase(getApprovedAdhesionAction.pending, (state) => {
                state.approvedAdhesions.loading = true;
                state.approvedAdhesions.errors = undefined;
            })
            .addCase(getApprovedAdhesionAction.fulfilled, (state, action) => {
                state.approvedAdhesions.loading = false;
                state.approvedAdhesions.payload = action.payload;
                state.approvedAdhesions.errors = undefined;
            })
            .addCase(getApprovedAdhesionAction.rejected, (state, action) => {
                state.approvedAdhesions.loading = false;
                state.approvedAdhesions.errors = undefined;
            })
            // REJECTED ADHESIONS
            .addCase(getRejectedAdhesionAction.pending, (state) => {
                state.rejectedAdhesions.loading = true;
                state.rejectedAdhesions.errors = undefined;
            })
            .addCase(getRejectedAdhesionAction.fulfilled, (state, action) => {
                state.rejectedAdhesions.loading = false;
                state.rejectedAdhesions.payload = action.payload;
                state.rejectedAdhesions.errors = undefined;
            })
            .addCase(getRejectedAdhesionAction.rejected, (state, action) => {
                state.rejectedAdhesions.loading = false;
                state.rejectedAdhesions.errors = undefined;
            })
    }
})

export default adhesionsStore.reducer;
