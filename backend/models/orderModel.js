const { Schema, model, Types } = require('../connection');

const orderSchema = new Schema({
    user: { type: Types.ObjectId, ref: 'user' },
    items: Array,
    paymentDetails: Object,
    intentId: {type : String, unique: true},
    status: { type: String, default: 'placed' },
    mode: { type: String, default: 'online' },
    createdAt: {type : Date, default: Date.now},
    
    // Shipping address
    shippingAddress: {
        name: String,
        mobile: String,
        pincode: String,
        state: String,
        city: String,
        address: String,
        locality: String,
        landmark: String,
        addressType: String
    },
    
    // Delivery options
    deliveryOption: {
        type: String,
        enum: ['normal', 'fast'],
        default: 'normal'
    },
    deliveryCharge: {
        type: Number,
        default: 0
    },
    estimatedDeliveryDate: Date,
    
    // Payment method
    paymentMethod: {
        type: String,
        enum: ['upi', 'card', 'netbanking', 'wallet', 'emi', 'cod'],
        default: 'cod'
    },
    
    // Tracking information
    tracking: [{
        status: String,
        message: String,
        location: String,
        timestamp: { type: Date, default: Date.now }
    }],
    
    // Order status history
    statusHistory: [{
        status: String,
        timestamp: { type: Date, default: Date.now },
        note: String
    }],
    
    // Courier details
    courierDetails: {
        courierName: String,
        trackingNumber: String,
        awbNumber: String
    },
    
    // Delivery dates
    orderPlacedAt: { type: Date, default: Date.now },
    processingAt: Date,
    shippedAt: Date,
    outForDeliveryAt: Date,
    deliveredAt: Date,
    
    // Return/Refund
    returnWindow: { type: Number, default: 7 }, // days
    returnRequested: { type: Boolean, default: false },
    returnReason: String,
    returnStatus: String,
    refundAmount: Number,
    refundStatus: String,
    
    // Totals
    subtotal: Number,
    tax: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    totalAmount: Number,
    
    // Seller notification
    sellerNotified: { type: Boolean, default: false },
    sellerNotifiedAt: Date

})

module.exports = model('ordersdata', orderSchema)