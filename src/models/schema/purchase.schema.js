import mongoose from "mongoose"

const purchaseCollection = "purchase"

const purchaseSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
    },
    purchase_datetime: {
        type: String,
        required: true,
    },
    amount: {
        type: Number,
        required: true
    },
    purchaser: {
        type: String,
        required: true,
    },
});

const PurchaseModel = mongoose.model(purchaseCollection, purchaseSchema);

export default PurchaseModel;