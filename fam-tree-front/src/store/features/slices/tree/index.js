import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {getTreeByUserId, addUserOnTree} from "../../../../api/feature/tree";
import {userLoginAction} from "../auth";

export const getTreeByUserIdAction = createAsyncThunk('get-tree-by-user-id', async (id) => {
    const response = await getTreeByUserId(id);
    console.log("GET TREE",response.data.content);
    return response.data.content;
});

export const addMemberToTreeAction = createAsyncThunk('add-member-to-tree', async ({data}) => {
    console.log(data);
    const response = await addUserOnTree(3, data);
    return response.data.content;
});


const initialState = {
    getUserTree: {
        loading: null,
        payload: null,
        errors: null
    }
}

const treeStore = createSlice({
    name: 'role',
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
                state.getUserTree.errors = undefined;
            })
    }
})

export default treeStore.reducer;
