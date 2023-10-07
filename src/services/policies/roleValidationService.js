import User from "../../models/schema/users.schema.js"

export function validateUserRole(user, role) {
    const result = user && user.role === role;
    return result;
}

export async function isUserAdminOrOwner(req, owner) {
    try {
        // Obtén el usuario actual
        const user = await User.findOne({ email: req.user.email });
        // Verifica si el usuario es administrador o es el propietario
        const result = user.role === 'admin' || user.email === owner;

        console.log("Nombre:", user.first_name);
        console.log("Email de usuario:", user.email);
        console.log(result);
        console.log("Owner:", owner);

        return result;
    } catch (error) {
        console.error(error);
        return false;
    }
}

