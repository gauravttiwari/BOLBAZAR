const {Schema, model}=require('../connection');

const sellerSchema = new Schema({
    fname:String,
    lname:String,
    email:String,
    password:String,
    createdAt: {type : Date, default: Date.now}
})

module.exports= model('seller',sellerSchema)