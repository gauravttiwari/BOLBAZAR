const {Schema, model}=require('../connection');

const sellerSchema = new Schema({
    fname:String,
    lname:String,
    email:String,
    password:String,
    businessName: String,
    publicKeys: [{
        key: String,
        deviceInfo: {
            browser: String,
            os: String,
            deviceName: String
        },
        createdAt: { type: Date, default: Date.now },
        lastUsed: { type: Date, default: Date.now }
    }],
    createdAt: {type : Date, default: Date.now}
})

module.exports= model('seller',sellerSchema)