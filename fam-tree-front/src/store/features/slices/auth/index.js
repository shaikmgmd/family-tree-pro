import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {userLogin, userFirstLogin, userLogout} from "../../../../api/feature/auth";

export const userLoginAction = createAsyncThunk('user-login', async ({payload}, {rejectWithValue}) => {
    try {
        const response = await userLogin(payload);
        return response.data.content;
    } catch (error) {
        if (!error.response) {
            throw error;
        }
        return rejectWithValue(error.response.data);
    }
});

export const userLogoutAction = createAsyncThunk('user-logout', async () => {
    const response = await userLogout();
    return response.data.content;
});

export const handleFirstLoginPasswordUpdateAction = createAsyncThunk('user-password-change', async ({payload}, {rejectWithValue}) => {
    try {
        const response = await userFirstLogin(payload);
        return response.data.content;
    } catch (error) {
        if (!error.response) {
            throw error;
        }
        return rejectWithValue(error.response.data);
    }
});


const initialState = {
    user: {
        loading: false,
        payload: null,
        errors: null,
    },
}

const authStore = createSlice({
    name: 'auth',
    initialState,
    reducers: {},
    extraReducers(builder) {
        builder
            .addCase(userLoginAction.pending, (state) => {
                state.user.loading = true;
                state.user.errors = undefined;
            })
            .addCase(userLoginAction.fulfilled, (state, action) => {
                state.user.loading = false;
                state.user.payload = action.payload;
                state.user.errors = undefined;
            })
            .addCase(userLoginAction.rejected, (state, action) => {
                state.user.loading = false;
                state.user.errors = undefined;
            })
    }
})

export default authStore.reducer;
