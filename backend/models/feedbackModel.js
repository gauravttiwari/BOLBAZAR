const {Schema, model}=require('../connection');

const feedbackSchema = new Schema({
    name:String,
    
    email:String,
    feedback:String,
})

module.exports= model('feedback',feedbackSchema)