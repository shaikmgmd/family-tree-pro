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