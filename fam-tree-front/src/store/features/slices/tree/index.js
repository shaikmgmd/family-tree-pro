import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {getTreeByUserId, addUserOnTree, addExistingUserOnTree, confirmRelationShip} from "../../../../api/feature/tree";
import {userLoginAction} from "../auth";
import confirmRelationship from "../../../../pages/confirm-relationship/ConfirmRelationship";

export const getTreeByUserIdAction = createAsyncThunk('get-tree-by-user-id', async (id, { rejectWithValue }) => {
        try {
            const response = await getTreeByUserId(id);
            console.log("GET TREE", response.data.content);
            return response.data.content;
        } catch (error) {
            // Utilisez rejectWithValue pour transmettre une erreur personnalisée à l'action rejetée
            return rejectWithValue(error.response.data);
        }
    }
);

export const addMemberToTreeAction = createAsyncThunk('add-member-to-tree', async ({ data }, { rejectWithValue }) => {
        try {
            console.log("DATA = " + data);
            const response = await addUserOnTree(3, data);
            console.log("response addmembertotree",response);
            return response.data.content;
        } catch (error) {
            console.log("error addmembertotree",error);
            console.log("error response addmembertotree",error.response);
            return rejectWithValue(error);
        }
    }
);

export const addExistingMemberToTreeAction = createAsyncThunk('add-existing-member-to-tree', async ({data}) => {
    console.log(data);
    const response = await addExistingUserOnTree(1, data)
    return response.data.content;
});

export const confirmRelationshipAction = createAsyncThunk('add-existing-member-to-tree', async (data) => {
    console.log("string confirmation code =>", data);
    const response = await confirmRelationShip(data);
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
                state.getUserTree.errors = action.errors; // très important
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
    }
})

export default treeStore.reducer;
