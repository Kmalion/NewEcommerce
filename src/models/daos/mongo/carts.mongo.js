import mongoose from 'mongoose';
import { MongoManager } from '../../db/manager/mongo.manager.js'
import Cart from '../../schema/carts.schema.js'


class CartsMongoDAO {     
    constructor() {
        MongoManager.start()
    }
    async findOne(query) {
        return Cart.findOne(query).exec();
    }
    async find(query) {
        return Cart.findOne(query).exec();
    }
    async findById(query) {
        return Cart.findById(query).exec();
    }
    async create(user) {
        return Cart.create(user)
    }
}

export default CartsMongoDAO