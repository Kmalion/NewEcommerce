import mongoose from "mongoose";
import Product from "../src/models/schema/products.schema.js";
import UsersModel from "../src/models/schema/users.schema.js";
import Config from "../src/config/config.js"


before (async()=>{
    await mongoose.connect(process.env.MONGO_URI)
})

after (async()=>{
    mongoose.connection.close()
})

export const  dropProduct = async()=>{
    await Product.collection.drop()
}
export const  dropUser = async()=>{
    await UsersModel.collection.drop()
}