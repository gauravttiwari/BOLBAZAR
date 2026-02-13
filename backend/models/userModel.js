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
    }],
    addresses: [{
        name: String,
        mobile: String,
        pincode: String,
        state: String,
        city: String,
        address: String,
        locality: String,
        landmark: String,
        addressType: { type: String, enum: ['home', 'work', 'other'], default: 'home' },
        isDefault: { type: Boolean, default: false },
        createdAt: { type: Date, default: Date.now }
    }]
})

module.exports= model('user',userSchema)