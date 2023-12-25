import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {
    getAllUsersExceptCurrent,
    getAllUsersExceptCurrentNoPagination,
    getConnectedUser,
    updateUser,
    getUserById
} from "../../../../api/feature/user";

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

export const getAllUsersExceptCurrentAction = createAsyncThunk('get-all-users-except-current', async () => {
    const response = await getAllUsersExceptCurrent();
    return response.data.content;
});

export const getAllUsersExceptCurrentNoPaginationAction = createAsyncThunk('get-all-users-except-current-no-pagination', async () => {
    const response = await getAllUsersExceptCurrentNoPagination();
    return response.data.content;
});

export const getUserByIdAction = createAsyncThunk('get-user-by-id', async (id) => {
    const response = await getUserById(id);
    return response.data.content;
});

const initialState = {
    getConnectedUser: {
        loading: false,
        payload: null,
        errors: null,
    },
    allUsersExceptCurrent: {
        loading: false,
        payload: null,
        errors: null,
    },
    allUsersExceptCurrentNP: {
        loading: false,
        payload: null,
        errors: null,
    },
    getUserById: {
        loading: false,
        payload: null,
        errors: null,
    }
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
            // user
            .addCase(getAllUsersExceptCurrentAction.pending, (state) => {
                state.allUsersExceptCurrent.loading = true;
            })
            .addCase(getAllUsersExceptCurrentAction.fulfilled, (state, action) => {
                state.allUsersExceptCurrent.loading = false;
                state.allUsersExceptCurrent.payload = action.payload; // maj de l'état pour stocker les data des user recup dans la partie appropriée de l'état global => application réagit et affiche ces data à l'user.
                state.allUsersExceptCurrent.errors = undefined;
            })
            .addCase(getAllUsersExceptCurrentAction.rejected, (state, action) => {
                state.allUsersExceptCurrent.loading = false;
                state.allUsersExceptCurrent.errors = undefined; // suivre les erreurs associées à la requête
            })
            // user - no pagination
            .addCase(getAllUsersExceptCurrentNoPaginationAction.pending, (state) => {
                state.allUsersExceptCurrentNP.loading = true;
            })
            .addCase(getAllUsersExceptCurrentNoPaginationAction.fulfilled, (state, action) => {
                state.allUsersExceptCurrentNP.loading = false;
                state.allUsersExceptCurrentNP.payload = action.payload;
                state.allUsersExceptCurrentNP.errors = undefined;
            })
            .addCase(getAllUsersExceptCurrentNoPaginationAction.rejected, (state, action) => {
                state.allUsersExceptCurrentNP.loading = false;
                state.allUsersExceptCurrentNP.errors = undefined;
            })
            // GET USER BY HIS ID
            .addCase(getUserByIdAction.pending, (state) => {
                state.getUserById.loading = true;
            })
            .addCase(getUserByIdAction.fulfilled, (state, action) => {
                state.getUserById.loading = false;
                state.getUserById.payload = action.payload;
                state.getUserById.errors = undefined;
            })
            .addCase(getUserByIdAction.rejected, (state, action) => {
                state.getUserById.loading = false;
                state.getUserById.errors = undefined;
            })
    }
})

export default userStore.reducer;
