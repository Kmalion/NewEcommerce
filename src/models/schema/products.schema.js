import mongoose from "mongoose";
import mongoPaginate from "mongoose-paginate-v2";

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    thumbnail: {
        type: String,
        required: true
    },
    code: {
        type: String,
        required: true
    },
    status: {
        type: Boolean,
        required: true
    },
    stock: {
        type: Number,
        required: true
    },
    owner: {
        type: String,
        ref: 'User', 
        required: true
    }
});

mongoose.plugin(mongoPaginate);

const Product = mongoose.model('Product', productSchema);

export default Product