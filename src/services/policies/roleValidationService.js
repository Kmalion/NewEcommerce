import User from "../../models/schema/users.schema.js";

class UserValidator {
    constructor() { }
    async validateUserRole(user, role) {
      console.log('User: ', user);
      console.log('Rol: ', role);
      const result = user && (user.role === role )
      console.log("Resultado validacion Rol: ", result);
      return result;
    }

  async isUserAdminOrOwner(user, owner) {
    try {
      // Obtén el usuario actual
      user = await User.findOne({ email: user.email });
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
}

export default UserValidator;

