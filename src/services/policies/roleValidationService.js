
export function validateUserRole(user, role) {
    const result = user && user.role === role;
    return result;
}