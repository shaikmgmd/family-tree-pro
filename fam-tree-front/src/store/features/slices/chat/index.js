import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getUserChatsWithMessages, sendChatMessage, getChatMessages, startChat } from "../../../../api/feature/chat";

export const getUserChatsWithMessagesAction = createAsyncThunk(
    'chat/get-user-chats-with-messages',
    async (userId) => {
        const response = await getUserChatsWithMessages(userId);
        return response.data.content;
    }
);

export const sendChatMessageAction = createAsyncThunk(
    'chat/send-chat-message',
    async ({ chatId, message }) => {
        const response = await sendChatMessage(chatId, message);
        return response.data.content;
    }
);

export const getChatMessagesAction = createAsyncThunk(
    'chat/get-chat-messages',
    async (chatId) => {
        const response = await getChatMessages(chatId);
        return response.data.content;
    }
);

export const startChatAction = createAsyncThunk(
    'chat/start-chat',
    async ({ userId1, userId2 }) => {
        const response = await startChat(userId1, userId2);
        return response.data.content;
    }
);

const initialState = {
    userChats: {
        loading: false,
        data: null,
        error: null
    },
    currentChat: {
        loading: false,
        data: null,
        error: null
    }
}

const chatStore = createSlice({
    name: 'chat',
    initialState,
    reducers: {},
    extraReducers(builder) {
        builder
            .addCase(getUserChatsWithMessagesAction.pending, (state) => {
                state.userChats.loading = true;
            })
            .addCase(getUserChatsWithMessagesAction.fulfilled, (state, action) => {
                state.userChats.loading = false;
                state.userChats.data = action.payload;
            })
            .addCase(getUserChatsWithMessagesAction.rejected, (state, action) => {
                state.userChats.loading = false;
                state.userChats.error = action.error.message;
            })
            .addCase(sendChatMessageAction.pending, (state) => {
                state.currentChat.loading = true;
            })
            .addCase(sendChatMessageAction.fulfilled, (state, action) => {
                state.currentChat.loading = false;
            })
            .addCase(sendChatMessageAction.rejected, (state, action) => {
                state.currentChat.loading = false;
                state.currentChat.error = action.error.message;
            })
            .addCase(getChatMessagesAction.pending, (state) => {
                state.currentChat.loading = true;
            })
            .addCase(getChatMessagesAction.fulfilled, (state, action) => {
                state.currentChat.loading = false;
            })
            .addCase(getChatMessagesAction.rejected, (state, action) => {
                state.currentChat.loading = false;
                state.currentChat.error = action.error.message;
            })
            .addCase(startChatAction.pending, (state) => {
                state.currentChat.loading = true;
            })
            .addCase(startChatAction.fulfilled, (state, action) => {
                state.currentChat.loading = false;
            })
            .addCase(startChatAction.rejected, (state, action) => {
                state.currentChat.loading = false;
                state.currentChat.error = action.error.message;
            })

        // ... Ajoutez d'autres extraReducers pour getChatMessagesAction et startChatAction
    }
});

export default chatStore.reducer;
