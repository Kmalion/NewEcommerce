import User from '../../models/schema/users.schema.js';

class UserService {
  async getAllUsers() {
    try {
      const users = await User.find().lean();
      return users;
    } catch (error) {
      throw error;
    }
  }
}

export default UserService;
