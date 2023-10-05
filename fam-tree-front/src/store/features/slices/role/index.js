import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {addAdminById, removeAdminById} from "../../../../api/feature/role";

export const addNewAdminAction = createAsyncThunk('add-admin', async (id) => {
    const response = await addAdminById(id);
    return response.data.content;
});

export const removeAdminAction = createAsyncThunk('remove-admin', async (id) => {
    const response = await removeAdminById(id);
    return response.data.content;
});


const initialState = {
}

const roleStore = createSlice({
    name: 'role',
    initialState,
    reducers: {},
    extraReducers(builder) {
    }
})

export default roleStore.reducer;
