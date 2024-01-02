export const isUserAdmin = (userData) => {
    return userData.roles && userData.roles.includes("ADMIN");
}