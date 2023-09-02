import mongoose from 'mongoose';
import { MongoManager } from '../../db/manager/mongo.manager.js'
import UsersModel from '../../schema/users.schema.js'


export class UsersMongoDAO {
    constructor() {
        MongoManager.start()
    }
    async findOne(query) {
        return UsersModel.findOne(query).exec();
    }
    async findById(query) {
        return UsersModel.findById(query).exec();
    }
    async create(user) {
        return UsersModel.create(user)
    }
}