export class UsersMemoryDAO {
    constructor() {
        this.users = []
    }
    async getAll() {
        return this.users
    }
}

