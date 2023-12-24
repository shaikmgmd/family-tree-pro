import {backend} from "../../config";
import {chatUrl} from "../../config/urls";

export const getUserChatsWithMessages = async () => (
    backend.get(chatUrl.GET_USER_CHATS_WITH_MESSAGES)
)

export const sendChatMessage = async () => (
    backend.post(chatUrl.SEND_CHAT_MESSAGE)
)

export const getChatMessages = async () => (
    backend.get(chatUrl.GET_CHAT_MESSAGES)
)

export const startChat = async () => (
    backend.post(chatUrl.START_CHAT)
)
