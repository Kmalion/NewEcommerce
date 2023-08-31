import mongoose from 'mongoose';
import { MongoManager } from '../../db/manager/mongo.manager.js'
import UsersModel from '../../schema/users.schema.js'

const UserSchema = new mongoose.Schema({
    email: String,
    password: String,
    // Otros campos de usuario
});
const UserModel = mongoose.model('User', UserSchema);

export class UsersMongoDAO {
    constructor() {
        MongoManager.start()
    }
    async findOne(query) {
        return UserModel.findOne(query).exec();
    }
}