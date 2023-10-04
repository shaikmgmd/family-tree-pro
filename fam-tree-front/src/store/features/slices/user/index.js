import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {getConnectedUser, updateUser} from "../../../../api/feature/user";

export const getConnectedUserAction = createAsyncThunk('get-user-connected', async () => {
    const response = await getConnectedUser();
    return response.data.content;
});

export const updateUserAction = createAsyncThunk('user-update', async ({payload}) => {
    const response = await updateUser(payload);
    console.log("Payload", payload)
    console.log("response", response.data)
    return response.data.content;
});


const initialState = {
    getConnectedUser: {
        loading: false,
        payload: null,
        errors: null,
    },
}

const userStore = createSlice({
    name: 'user',
    initialState,
    reducers: {},
    extraReducers(builder) {
        builder
            // GET CURRENT USER FULL INFOS
            .addCase(getConnectedUserAction.pending, (state) => {
                state.getConnectedUser.loading = true;
                state.getConnectedUser.errors = undefined;
            })
            .addCase(getConnectedUserAction.fulfilled, (state, action) => {
                state.getConnectedUser.loading = false;
                state.getConnectedUser.payload = action.payload;
                state.getConnectedUser.errors = undefined;
            })
            .addCase(getConnectedUserAction.rejected, (state, action) => {
                state.getConnectedUser.loading = false;
                state.getConnectedUser.errors = undefined;
            })
            // UPDATE USER
            .addCase(updateUserAction.pending, (state) => {
                state.getConnectedUser.loading = true;
                state.getConnectedUser.errors = undefined;
            })
            .addCase(updateUserAction.fulfilled, (state, action) => {
                state.getConnectedUser.loading = false;
                state.getConnectedUser.payload = action.payload;
                state.getConnectedUser.errors = undefined;
            })
            .addCase(updateUserAction.rejected, (state, action) => {
                state.getConnectedUser.loading = false;
                state.getConnectedUser.errors = undefined;
            })
    }
})

export default userStore.reducer;
