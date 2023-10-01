import dotenv from "dotenv"
dotenv.config();

export default {
    mongo:{
    MONGO_URI: process.env.MONGO_URI || '',
    PORT: process.env.PORT || 8080,
    },
    mailing:{
        SERVICE: process.env.MAILING_SERVICE,
        USER: process.env.MAILING_USER,
        PASSWORD: process.env.MAILING_PASSWORD
    },
    jwt:{
        COOKIE: process.env.JWT_COOKIE,
        SECRET: process.env.JWT_SECRET
    }
}
