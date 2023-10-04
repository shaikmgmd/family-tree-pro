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
    UPDATE_USER: `/user/update`,
}