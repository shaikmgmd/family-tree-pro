import chat from "../../pages/chat/Chat";
import {getAllUsers} from "../../store/features/slices/user";

export const featureExampleUrl = {
    URL_EXAMPLE: '/example',
    URL_EXAMPLE_2: (urlParam) => `/example2/${urlParam}`,
}

export const adhesionUrl = {
    CREATE_ADHESION: '/adhesion',
    APPROVE_ADHESION: (requestId) => `/adhesion/approve/${requestId}`,
    REJECT_ADHESION: (requestId) => `/adhesion/reject/${requestId}`,
    GET_ADHESIONS_BY_STATUS: '/adhesion/requests',
    GET_APPROVED_ADHESIONS: '/adhesion/approved',
    GET_PENDING_ADHESIONS: '/adhesion/pending',
}

export const authUrl = {
    LOGIN: '/auth/sign-in',
    LOGOUT: '/auth/sign-out',
    REGISTER: `/auth/sign-up`,
    FIRST_LOGIN: `/auth/update-first-password`,
}

export const userUrl = {
    GET_CONNECTED_USER: `/user`,
    GET_USER_BY_ID: (userId) => `/user/${userId}`,
    UPDATE_USER: `/user/update`,
    GET_ALL_USERS_EXCEPT_CURRENT: (page, size) => `/user/all-except-current/${page}/${size}`,
    GET_ALL_USERS_EXCEPT_CURRENT_NO_PAGINATION: `/user/all-except-current-no-pagination`,
    GET_ALL_USERS: `/user/all`,
}

export const roleUrl = {
    ADD_ADMIN_BY_ID: (userId) => `/role/add-admin/${userId}`,
    REMOVE_ADMIN_BY_ID: (userId) => `/role/remove-admin/${userId}`,
}

export const treeUrl = {
    GET_TREE_BY_USER_ID: (userId) => `/family-tree/${userId}`,
    ADD_USER_ON_TREE: (userId) => `/family-tree/${userId}`,
    GET_BFS: `/family-tree/bfs`,
    GET_DFS: `/family-tree/dfs`,
    ADD_EXISTING_USER_ON_TREE: (userId) => `/relationship-confirmation/add-existing-user`,
    CONFIRM_RELATIONSHIP: (confirmation) => `/relationship-confirmation/accept/${confirmation}`,
    REFUSE_RELATIONSHIP: (confirmation) => `/relationship-confirmation/refuse/${confirmation}`,
}

export const chatUrl = {
    GET_USER_CHATS_WITH_MESSAGES: (userId) => `/chat/${userId}/chats`,
    SEND_CHAT_MESSAGE: `/chat/send`,
    GET_CHAT_MESSAGES: (chatId) => `/chat/${chatId}/messages`,
    START_CHAT: (userId1, userId2) => `/chat/start?userId1=${userId1}&userId2=${userId2}`,
}

export const statsUrl = {
    GET_TOTAL_VIEWS: `/view/total-since-creation`,
    GET_LAST_7_DAYS: `/view/last-7-days`,
    GET_LAST_30_DAYS: `/view/last-30-days`,
    GET_VIEWS_PER_DAY: `/view/views-per-day-since-creation`,
    POST_RECORD: `/view/record`,
}

export const testsUrl = {
    GET_ALL_TESTS_RESULTS: `/test-results`,
}