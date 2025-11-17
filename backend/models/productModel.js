const { Schema, model, Types } = require('../connection');

const productSchema = new Schema({
    seller: { type: Types.ObjectId, ref: 'seller' },
    pname: String,
    pdetail: String,
    category: String,
    features: Array,
    pprice: Number,
    images: Array,
    createdAt: {type : Date, default : Date.now},

})

module.exports = model('product', productSchema)