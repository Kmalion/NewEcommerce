import mongoose from "mongoose"

const usersCollection = "users"

const userSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: false,
    },
    last_name: {
        type: String,
        required: false,
    },
    email: {
        type: String,
        required: false,
        unique: true,
    },
    password: {
        type: String,
        required: false,
    },
    age: {
        type: Number,
        required: false,
    },
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user',
        required: true,
    },
    githubId: {
        type: String
    },

    username: {
        type: String,
    }
});

const UsersModel = mongoose.model(usersCollection, userSchema);

export default UsersModel;