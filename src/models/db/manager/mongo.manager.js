import mongoose from "mongoose";
import CONFIG from '../../../config/config.js'


export class MongoManager {
    static #instance;

    constructor() {
        mongoose.connect(CONFIG.mongo.MONGO_URI)
            .then(() => {
                console.log("Connected to DB")
            })
            .catch((error) => {
                console.log("Error on Connection to DB")
                throw error
            })
    }
    static start() {
        if (!this.#instance) {
            this.#instance = new MongoManager()
        }
        return this.#instance

    }
}