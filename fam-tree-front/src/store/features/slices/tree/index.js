import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {
    getTreeByUserId,
    addUserOnTree,
    addExistingUserOnTree,
    confirmRelationShip,
    getDFS,
    getBFS, refuseRelationShip
} from "../../../../api/feature/tree";
import {userLoginAction} from "../auth";
import confirmRelationship from "../../../../pages/confirm-relationship/ConfirmRelationship";

export const getTreeByUserIdAction = createAsyncThunk('get-tree-by-user-id', async (id, {rejectWithValue}) => {
        try {
            const response = await getTreeByUserId(id);
            return response.data.content;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const addMemberToTreeAction = createAsyncThunk('add-member-to-tree', async ({data}, {rejectWithValue}) => {
        try {
            const response = await addUserOnTree(3, data);
            return response.data.content;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const addExistingMemberToTreeAction = createAsyncThunk('add-existing-member-to-tree', async ({data}) => {
    console.log(data);
    const response = await addExistingUserOnTree(1, data)
    return response.data.content;
});

export const confirmRelationshipAction = createAsyncThunk('accept-relation', async (data) => {
    const response = await confirmRelationShip(data);
    return response.data.content;
});

export const refuseRelationshipAction = createAsyncThunk('refuse-relation', async (data) => {
    const response = await refuseRelationShip(data);
    return response.data.content;
});

export const getDfsAction = createAsyncThunk('get-dfs', async () => {
    const response = await getDFS();
    return response.data.content;
});

export const getBfsAction = createAsyncThunk('get-bfs', async () => {
    const response = await getBFS();
    return response.data.content;
});

const initialState = {
    getUserTree: {
        loading: null,
        payload: null,
        errors: null
    },
    relationConfirmation: {
        loading: null,
        payload: null,
        errors: null
    },
    treeDFS: {
        loading: null,
        payload: null,
        errors: null
    },
    treeBFS: {
        loading: null,
        payload: null,
        errors: null
    },
}

const treeStore = createSlice({
    name: 'tree',
    initialState,
    reducers: {},
    extraReducers(builder) {
        builder
            .addCase(getTreeByUserIdAction.pending, (state) => {
                state.getUserTree.loading = true;
                state.getUserTree.errors = undefined;
            })
            .addCase(getTreeByUserIdAction.fulfilled, (state, action) => {
                state.getUserTree.loading = false;
                state.getUserTree.payload = action.payload;
                state.getUserTree.errors = undefined;
            })
            .addCase(getTreeByUserIdAction.rejected, (state, action) => {
                state.getUserTree.loading = false;
                state.getUserTree.errors = action.errors;
            })
            // confirmation
            .addCase(confirmRelationshipAction.pending, (state) => {
                state.relationConfirmation.loading = true;
                state.relationConfirmation.errors = undefined;
            })
            .addCase(confirmRelationshipAction.fulfilled, (state, action) => {
                state.relationConfirmation.loading = false;
                state.relationConfirmation.payload = action.payload;
                state.relationConfirmation.errors = undefined;
            })
            .addCase(confirmRelationshipAction.rejected, (state, action) => {
                state.relationConfirmation.loading = false;
                state.relationConfirmation.errors = undefined;
            })
            // refuse
            .addCase(refuseRelationshipAction.pending, (state) => {
                state.relationConfirmation.loading = true;
                state.relationConfirmation.errors = undefined;
            })
            .addCase(refuseRelationshipAction.fulfilled, (state, action) => {
                state.relationConfirmation.loading = false;
                state.relationConfirmation.payload = action.payload;
                state.relationConfirmation.errors = undefined;
            })
            .addCase(refuseRelationshipAction.rejected, (state, action) => {
                state.relationConfirmation.loading = false;
                state.relationConfirmation.errors = undefined;
            })
            // BFS
            .addCase(getBfsAction.pending, (state) => {
                state.treeBFS.loading = true;
                state.treeBFS.errors = undefined;
            })
            .addCase(getBfsAction.fulfilled, (state, action) => {
                state.treeBFS.loading = false;
                state.treeBFS.payload = action.payload;
                state.treeBFS.errors = undefined;
            })
            .addCase(getBfsAction.rejected, (state, action) => {
                state.treeBFS.loading = false;
                state.treeBFS.errors = undefined;
            })
            // DFS
            .addCase(getDfsAction.pending, (state) => {
                state.treeDFS.loading = true;
                state.treeDFS.errors = undefined;
            })
            .addCase(getDfsAction.fulfilled, (state, action) => {
                state.treeDFS.loading = false;
                state.treeDFS.payload = action.payload;
                state.treeDFS.errors = undefined;
            })
            .addCase(getDfsAction.rejected, (state, action) => {
                state.treeDFS.loading = false;
                state.treeDFS.errors = undefined;
            })
    }
})

export default treeStore.reducer;
