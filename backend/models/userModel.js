const {Schema, model}=require('../connection');

const userSchema = new Schema({
    fname:String,
    lname:String,
    email:String,
    password:String,
})

module.exports= model('user',userSchema)