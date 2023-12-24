// familytreeuserSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    data: [],
    loading: false,
    hasMore: true,
};

const familytreeuserSlice = createSlice({
    name: 'familytreeuser',
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
    },
});

export const { setUsers, addUsers, setLoading, setHasMore} = familytreeuserSlice.actions;
export default familytreeuserSlice.reducer;
