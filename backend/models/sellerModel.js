const {Schema, model}=require('../connection');

const sellerSchema = new Schema({
    fname:String,
    lname:String,
    email:String,
    password:String,
    businessName: String,
    phone: String,
    address: String,
    city: String,
    state: String,
    country: { type: String, default: 'India' },
    pincode: String,
    avatar: String,
    bio: String,
    website: String,
    gstNumber: String,
    panNumber: String,
    bankName: String,
    accountNumber: String,
    ifscCode: String,
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