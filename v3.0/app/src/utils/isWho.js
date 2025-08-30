
export function isAdmin(user) {
    if (user) {
        return user.role === "admin" ? true : false;
    }
    return false;
}

export function isUser(user) {
    if (user) {
        return user.role === "user" ? true : false;
    }
    return false;
}