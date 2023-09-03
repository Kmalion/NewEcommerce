import mongoose from 'mongoose';
import { MongoManager } from '../../db/manager/mongo.manager.js'
import Product from '../../schema/products.schema.js'


export class ProductsMongoDAO {     
    constructor() {
        MongoManager.start()
    }
    async findOne(query) {
        return Product.findOne(query).exec();
    }
    async findById(query) {
        return Product.findById(query).exec();
    }
    async create(user) {
        return Product.create(user)
    }
}