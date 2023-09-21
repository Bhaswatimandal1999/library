const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    books: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Book' }],
    totalAmount: Number
});

const OrderModel = mongoose.model("Order", orderSchema)
module.exports = { OrderModel }