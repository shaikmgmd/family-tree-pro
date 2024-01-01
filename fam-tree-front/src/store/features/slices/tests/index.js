import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {getAllTestsResults} from "../../../../api/feature/tests";


export const getAllTestsResultsAction = createAsyncThunk('get-all-tests', async () => {
    const response = await getAllTestsResults();
    console.log("all tests",response);
    return response.data.content;
});

const initialState = {
    allTestsResults: {
        loading: null,
        payload: null,
        errors: null
    },
}

const testsStore = createSlice({
    name: 'tests',
    initialState,
    reducers: {},
    extraReducers(builder) {
        builder
            // get all tests results
            .addCase(getAllTestsResultsAction.pending, (state) => {
                state.allTestsResults.loading = true;
                state.allTestsResults.errors = undefined;
            })
            .addCase(getAllTestsResultsAction.fulfilled, (state, action) => {
                state.allTestsResults.loading = false;
                state.allTestsResults.payload = action.payload;
                state.allTestsResults.errors = undefined;
            })
            .addCase(getAllTestsResultsAction.rejected, (state, action) => {
                state.allTestsResults.loading = false;
                state.allTestsResults.errors = action.errors; // très important
            })
    }
})

export default testsStore.reducer;