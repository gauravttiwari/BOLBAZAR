const {Schema, model}=require('../connection');

const userSchema = new Schema({
    fname:String,
    lname:String,
    email:String,
    password:String,
    publicKeys: [{
        key: String,
        deviceInfo: String,
        createdAt: { type: Date, default: Date.now },
        lastUsed: { type: Date, default: Date.now }
    }]
})

module.exports= model('user',userSchema)