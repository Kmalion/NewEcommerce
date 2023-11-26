import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UsersModel', // Ajusta 'User' según el nombre de tu modelo de usuario
        required: true
    },
    date: {
        type: String,
        required: true
    },
    products: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        quantity: {
            type: Number,
            default: 1
        }
    }]
});

cartSchema.pre('findOne', function (next) {
    this.populate('products.product');
    next();
});
cartSchema.pre('find', function (next) {
    this.populate('products.product');
    next();
});
cartSchema.pre('findById', function (next) {
    this.populate('products.product');
    next();
});

const CartSchema = mongoose.model('Cart', cartSchema);

export default CartSchema;
