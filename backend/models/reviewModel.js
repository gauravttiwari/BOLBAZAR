const { Schema, model, Types}=require('../connection');

const reviewSchema = new Schema({
    user: {type:Types.ObjectId, ref:'user'},
    product: {type:Types.ObjectId, ref:'product'},
    rating:Number,
    review:String,
    images:Array,
    createdAt:{type : Date, default: Date.now}
})

module.exports= model('review',reviewSchema)