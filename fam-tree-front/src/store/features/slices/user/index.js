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

export const getAllUsersExceptCurrentAction = createAsyncThunk('get-all-users-except-current', async () => {
    const response = await getAllUsersExceptCurrent();
    return response.data.content;  // Ajustez en fonction de la structure de votre réponse
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
    }
})

export default userStore.reducer;
