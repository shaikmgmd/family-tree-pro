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

/*export const getAllUsersExceptCurrentAction = createAsyncThunk('get-all-users-except-current', async () => {
    const response = await getAllUsersExceptCurrent();
    return response.data.content;
});*/

export const getAllUsersExceptCurrentAction = createAsyncThunk('get-all-users-except-current', async ({ page, size }, { rejectWithValue }) => {
    try {
        console.log("page : " + page);
        console.log("size : " + size);
        const response = await getAllUsersExceptCurrent(page, size);
        return response.data.content; // ou response.data
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

export const getAllUsersAction = createAsyncThunk('get-all-users', async () => {
    const response = await getAllUsers();
    console.log("response : " + response);
    console.log("response.data.length : " + response.data.length);
    console.log("response.data.content.length : " + response.data.content.length);
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
        data: [],
        page: 0,
        size: 2,
        hasMore: true,
    },
    AllUsers: {
        loading: false,
        payload: null,
        errors: null,
    },
    getUserById: {
        loading: false,
        payload: null,
        errors: null,
    },
    getAllUsers: {
        loading: false,
        payload: null,
        errors: null,
    }
}

const userStore = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUsers: (state, action) => {
            // { type, payload }
            state.data = action.payload;
        },
        addUsers: (state, action) => {
            state.data = state.data.concat(action.payload);
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setHasMore: (state, action) => {
            state.hasMore = action.payload;
        },
        resetAllUsersExceptCurrent: (state) => {
            state.allUsersExceptCurrent = initialState.allUsersExceptCurrent;
        }
    },
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
            .addCase(getAllUsersAction.pending, (state) => {
                state.getAllUsers.loading = true;
                state.getAllUsers.errors = undefined;
            })
            .addCase(getAllUsersAction.fulfilled, (state, action) => {
                state.getAllUsers.loading = false;
                state.getAllUsers.payload = action.payload;
                state.getAllUsers.errors = undefined;
            })
            .addCase(getAllUsersAction.rejected, (state, action) => {
                state.getAllUsers.loading = false;
                state.getAllUsers.errors = undefined;
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
                state.allUsersExceptCurrent.data = [...state.allUsersExceptCurrent.data, ...action.payload];
                state.allUsersExceptCurrent.page += 1;
                state.allUsersExceptCurrent.hasMore = action.payload.length !== 0; // condition hasMore
            })
            .addCase(getAllUsersExceptCurrentAction.rejected, (state, action) => {
                state.allUsersExceptCurrent.loading = false;
                state.allUsersExceptCurrent.errors = action.error.message; // suivre les erreurs associées à la requête
                state.allUsersExceptCurrent.hasMore = false;
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

export const { setUsers, addUsers, setLoading, setHasMore, resetAllUsersExceptCurrent} = userStore.actions;
export default userStore.reducer;
