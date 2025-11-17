const { Schema, model} = require('../connection');

const contactSchema = new Schema({
    fname:String,
    lname:String,
    email:String,
    message:String
})

module.exports= model('/contact',contactSchema)