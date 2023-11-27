import mongoose from "mongoose";

const usersCollection = "users";

const documentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: false,
    },
    link: {
        type: String,
        required: false,
    }, 
    profilePic: {
        type: String,
        required: false,
    },
});

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
        enum: ['admin', 'user', 'premium'],
        default: 'user',
        required: true,
    },
    githubId: {
        type: String,
    },
    username: {
        type: String,
    },
    resetToken: {
        type: String,
    },
    resetTokenExpires: {
        type: Date,
    },
    lastLogin: {
        type: Date,
    },
    lastLogout: {
        type: Date,
    },
    documents: [documentSchema],  // Agrega la propiedad de documentos al modelo de usuario
});

const UsersModel = mongoose.model(usersCollection, userSchema);

export default UsersModel;
