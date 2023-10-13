import User from "../../models/schema/users.schema.js";

class UserValidator {
    constructor() { }

    async validateUserRole(user, role) {
      const result = user && (user.role === role )
      return result;
    }

  async isUserAdminOrOwner(user, owner) {
    try {
      // Obtén el usuario actual
      user = await User.findOne({ email: user.email });
      // Verifica si el usuario es administrador o es el propietario
      const result = user.role === 'admin' || user.email === owner;
      return result;
    } catch (error) {
      console.error(error);
      return false;
    }
  }
  async isOwner(user, products) {
    const results = [];
    for (const product of products) {
      try {
        const userEmail = await User.findOne({ email: user.email });
        if (userEmail) {
          const result = userEmail.email === product.owner;
          results.push(result);
        } else {
          results.push(false);
        }
      } catch (error) {
        console.error(error);
        results.push(false);
      }
    }
    return results;
  }
}

export default UserValidator;

