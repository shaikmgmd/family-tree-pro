import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {getUserChatsWithMessages, sendChatMessage, getChatMessages, startChat} from "../../../../api/feature/chat";

export const getUserChatsWithMessagesAction = createAsyncThunk(
    'chat/get-user-chats-with-messages',
    async (userId) => {
        const response = await getUserChatsWithMessages(userId);
        return response.data.content;
    }
);

export const sendChatMessageAction = createAsyncThunk(
    'chat/send-chat-message',
    async (payload) => {
        const response = await sendChatMessage(payload);
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
    async ({userId1, userId2}) => {
        const response = await startChat(userId1, userId2);
        return response.data.content;
    }
);

const initialState = {
    userChats: {
        loading: false,
        payload: null,
        error: null
    },
    chatMessages: {
        loading: false,
        payload: null,
        error: null
    },
    currentChat: {
        loading: false,
        payload: null,
        error: null
    },
}

const chatStore = createSlice({
    name: 'chat',
    initialState,
    reducers: {},
    extraReducers(builder) {
        builder
            // Get user chats WITH messages --> GET
            .addCase(getUserChatsWithMessagesAction.pending, (state) => {
                state.userChats.loading = true;
            })
            .addCase(getUserChatsWithMessagesAction.fulfilled, (state, action) => {
                state.userChats.loading = false;
                state.userChats.payload = action.payload;
            })
            .addCase(getUserChatsWithMessagesAction.rejected, (state, action) => {
                state.userChats.loading = false;
                state.userChats.error = action.error.message;
            })
            // Send chat message --> POST
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
            // Get chats messages --> GET
            .addCase(getChatMessagesAction.pending, (state) => {
                state.chatMessages.loading = true;
            })
            .addCase(getChatMessagesAction.fulfilled, (state, action) => {
                state.chatMessages.loading = false;
                state.chatMessages.payload = action.payload;
            })
            .addCase(getChatMessagesAction.rejected, (state, action) => {
                state.chatMessages.loading = false;
                state.chatMessages.error = action.error.message;
            })
    }
});

export default chatStore.reducer;
