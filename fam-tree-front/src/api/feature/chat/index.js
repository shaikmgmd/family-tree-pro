import {backend} from "../../config";
import {chatUrl} from "../../config/urls";

export const getUserChatsWithMessages = async (chatId) => (
    backend.get(chatUrl.GET_USER_CHATS_WITH_MESSAGES(chatId))
)

export const sendChatMessage = async (payload) => (
    backend.post(chatUrl.SEND_CHAT_MESSAGE, payload)
)

export const getChatMessages = async (chatId) => (
    backend.get(chatUrl.GET_CHAT_MESSAGES(chatId))
)

export const startChat = async (userId1, userId2) => (
    backend.post(chatUrl.START_CHAT(userId1, userId2))
)
