const {Schema, model}=require('../connection');

const adminSchema = new Schema({
    fname:String,
    lname:String,
    email:String,
    password:String,
    createdAt: {type : Date, default: Date.now}
})

module.exports= model('admin',adminSchema)