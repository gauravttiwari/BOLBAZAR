const express = require('express');
const router = express.Router();
const Model = require('../models/orderModel');
const { model } = require('mongoose');

router.post('/add', (req, res) => {
    console.log(req.body);
    // Calculate total from items
    const items = req.body.items || [];
    const total = items.reduce((sum, item) => sum + ((item.price ?? item.pprice) * (item.quantity || 1)), 0);
    // Set paymentDetails.amount (Stripe expects paise, so multiply by 100)
    if (!req.body.paymentDetails) req.body.paymentDetails = {};
    req.body.paymentDetails.amount = Math.round(total * 100);
    new Model(req.body).save()
        .then((result) => {
            console.log(result);
            res.status(200).json(result);
        }).catch((err) => {
            console.log(err);
            res.status(500).json(err);
        })
});

// getall

router.get('/getall', (req, res) => {
    Model.find()
        .then((result) => {
            res.status(200).json(result);
        }).catch((err) => {
            res.status(500).json(err);
        })
});

router.delete('/delete/:id', (req, res) => {
    Model.findByIdAndDelete(req.params.id)
        .then((result) => {
            res.status(200).json(result);
        }).catch((err) => {
            res.status(500).json(err)
        });
});

// Get orders by seller ID (items contain seller reference)
router.get('/getbyseller/:sellerId', async (req, res) => {
    try {
        const sellerId = req.params.sellerId;
        const orders = await Model.find({}).populate('user', 'fname lname email');
        
        // Filter orders that contain items from this seller
        const sellerOrders = orders.filter(order => {
            return order.items && order.items.some(item => item.seller === sellerId);
        }).map(order => {
            // Only include items from this seller
            const sellerItems = order.items.filter(item => item.seller === sellerId);
            return {
                ...order.toObject(),
                items: sellerItems,
                sellerTotal: sellerItems.reduce((sum, item) => sum + (item.pprice * (item.quantity || 1)), 0)
            };
        });
        
        res.status(200).json(sellerOrders);
    } catch (err) {
        console.error('Error fetching seller orders:', err);
        res.status(500).json(err);
    }
});

// Get seller dashboard statistics
router.get('/seller-stats/:sellerId', async (req, res) => {
    try {
        const sellerId = req.params.sellerId;
        const orders = await Model.find({});
        
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        const lastWeek = new Date(today);
        lastWeek.setDate(lastWeek.getDate() - 7);
        const lastMonth = new Date(today);
        lastMonth.setMonth(lastMonth.getMonth() - 1);
        
        // Filter and calculate seller-specific metrics
        let totalRevenue = 0;
        let todayRevenue = 0;
        let yesterdayRevenue = 0;
        let weekRevenue = 0;
        let lastWeekRevenue = 0;
        let monthRevenue = 0;
        let lastMonthRevenue = 0;
        let totalOrders = 0;
        let todayOrders = 0;
        let pendingOrders = 0;
        let completedOrders = 0;
        let totalItemsSold = 0;
        
        // Daily sales data for chart (last 30 days)
        const dailySales = {};
        const dailyOrders = {};
        for (let i = 29; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const dateKey = date.toISOString().split('T')[0];
            dailySales[dateKey] = 0;
            dailyOrders[dateKey] = 0;
        }
        
        // Recent orders for display
        const recentOrders = [];
        
        orders.forEach(order => {
            if (!order.items) return;
            
            const sellerItems = order.items.filter(item => item.seller === sellerId);
            if (sellerItems.length === 0) return;
            
            const orderDate = new Date(order.createdAt);
            const orderTotal = sellerItems.reduce((sum, item) => sum + (item.pprice * (item.quantity || 1)), 0);
            const itemCount = sellerItems.reduce((sum, item) => sum + (item.quantity || 1), 0);
            
            totalRevenue += orderTotal;
            totalOrders++;
            totalItemsSold += itemCount;
            
            // Track order status
            if (order.status === 'placed' || order.status === 'processing') {
                pendingOrders++;
            } else if (order.status === 'delivered' || order.status === 'completed') {
                completedOrders++;
            }
            
            // Today's metrics
            if (orderDate >= today) {
                todayRevenue += orderTotal;
                todayOrders++;
            }
            
            // Yesterday's metrics
            if (orderDate >= yesterday && orderDate < today) {
                yesterdayRevenue += orderTotal;
            }
            
            // This week's metrics
            if (orderDate >= lastWeek) {
                weekRevenue += orderTotal;
            }
            
            // Last week's metrics (7-14 days ago)
            const twoWeeksAgo = new Date(lastWeek);
            twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 7);
            if (orderDate >= twoWeeksAgo && orderDate < lastWeek) {
                lastWeekRevenue += orderTotal;
            }
            
            // This month's metrics
            if (orderDate >= lastMonth) {
                monthRevenue += orderTotal;
            }
            
            // Last month's metrics
            const twoMonthsAgo = new Date(lastMonth);
            twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 1);
            if (orderDate >= twoMonthsAgo && orderDate < lastMonth) {
                lastMonthRevenue += orderTotal;
            }
            
            // Daily sales chart data
            const dateKey = orderDate.toISOString().split('T')[0];
            if (dailySales.hasOwnProperty(dateKey)) {
                dailySales[dateKey] += orderTotal;
                dailyOrders[dateKey]++;
            }
            
            // Collect recent orders
            if (recentOrders.length < 10) {
                recentOrders.push({
                    _id: order._id,
                    items: sellerItems,
                    total: orderTotal,
                    status: order.status,
                    createdAt: order.createdAt,
                    user: order.user
                });
            }
        });
        
        // Sort recent orders by date
        recentOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        
        // Calculate growth percentages
        const weekGrowth = lastWeekRevenue > 0 
            ? Math.round(((weekRevenue - lastWeekRevenue) / lastWeekRevenue) * 100) 
            : weekRevenue > 0 ? 100 : 0;
        
        const dayGrowth = yesterdayRevenue > 0 
            ? Math.round(((todayRevenue - yesterdayRevenue) / yesterdayRevenue) * 100) 
            : todayRevenue > 0 ? 100 : 0;
        
        const monthGrowth = lastMonthRevenue > 0 
            ? Math.round(((monthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100) 
            : monthRevenue > 0 ? 100 : 0;
        
        // Format chart data
        const chartData = Object.keys(dailySales).map(date => ({
            date,
            sales: dailySales[date],
            orders: dailyOrders[date]
        }));
        
        res.status(200).json({
            totalRevenue,
            todayRevenue,
            weekRevenue,
            monthRevenue,
            totalOrders,
            todayOrders,
            pendingOrders,
            completedOrders,
            totalItemsSold,
            weekGrowth,
            dayGrowth,
            monthGrowth,
            chartData,
            recentOrders
        });
    } catch (err) {
        console.error('Error fetching seller stats:', err);
        res.status(500).json(err);
    }
});

// Update order status
router.put('/update/:id', (req, res) => {
    Model.findByIdAndUpdate(req.params.id, req.body, { new: true })
        .then((result) => {
            res.status(200).json(result);
        }).catch((err) => {
            res.status(500).json(err);
        });
});

// Get order by ID
router.get('/getbyid/:id', (req, res) => {
    Model.findById(req.params.id)
        .populate('user', 'fname lname email')
        .then((result) => {
            if (!result) {
                return res.status(404).json({ message: 'Order not found' });
            }
            res.status(200).json(result);
        }).catch((err) => {
            console.error('Error fetching order:', err);
            res.status(500).json(err);
        });
});

// Get orders by user ID
router.get('/getbyuser/:userId', (req, res) => {
    Model.find({ user: req.params.userId })
        .sort({ createdAt: -1 })
        .then((result) => {
            res.status(200).json(result);
        }).catch((err) => {
            console.error('Error fetching user orders:', err);
            res.status(500).json(err);
        });
});

// Update order status with tracking
router.put('/update-status/:id', async (req, res) => {
    try {
        const { status, message, location } = req.body;
        const order = await Model.findById(req.params.id);
        
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        
        // Update status
        order.status = status;
        
        // Add to status history
        order.statusHistory.push({
            status,
            timestamp: new Date(),
            note: message || `Order status changed to ${status}`
        });
        
        // Add tracking information
        if (message || location) {
            order.tracking.push({
                status,
                message: message || `Order ${status}`,
                location: location || '',
                timestamp: new Date()
            });
        }
        
        // Update specific timestamps
        const now = new Date();
        switch(status) {
            case 'processing':
                order.processingAt = now;
                break;
            case 'shipped':
                order.shippedAt = now;
                break;
            case 'out_for_delivery':
                order.outForDeliveryAt = now;
                break;
            case 'delivered':
                order.deliveredAt = now;
                break;
        }
        
        await order.save();
        res.status(200).json(order);
    } catch (err) {
        console.error('Error updating order status:', err);
        res.status(500).json(err);
    }
});

// Add courier details
router.put('/add-courier-details/:id', async (req, res) => {
    try {
        const order = await Model.findByIdAndUpdate(
            req.params.id,
            { 
                courierDetails: req.body,
                status: 'shipped',
                shippedAt: new Date()
            },
            { new: true }
        );
        
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        
        // Add tracking entry
        order.tracking.push({
            status: 'shipped',
            message: `Order shipped via ${req.body.courierName}`,
            timestamp: new Date()
        });
        
        await order.save();
        res.status(200).json(order);
    } catch (err) {
        console.error('Error adding courier details:', err);
        res.status(500).json(err);
    }
});

// Request return
router.put('/request-return/:id', async (req, res) => {
    try {
        const { returnReason } = req.body;
        const order = await Model.findById(req.params.id);
        
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        
        if (order.status !== 'delivered') {
            return res.status(400).json({ message: 'Can only return delivered orders' });
        }
        
        // Check if within return window
        const deliveryDate = new Date(order.deliveredAt);
        const today = new Date();
        const daysSinceDelivery = Math.floor((today - deliveryDate) / (1000 * 60 * 60 * 24));
        
        if (daysSinceDelivery > order.returnWindow) {
            return res.status(400).json({ 
                message: `Return window of ${order.returnWindow} days has expired` 
            });
        }
        
        order.returnRequested = true;
        order.returnReason = returnReason;
        order.returnStatus = 'pending';
        order.status = 'return_requested';
        
        order.statusHistory.push({
            status: 'return_requested',
            timestamp: new Date(),
            note: `Return requested: ${returnReason}`
        });
        
        await order.save();
        res.status(200).json(order);
    } catch (err) {
        console.error('Error requesting return:', err);
        res.status(500).json(err);
    }
});

// Process refund
router.put('/process-refund/:id', async (req, res) => {
    try {
        const { refundAmount, refundStatus } = req.body;
        const order = await Model.findByIdAndUpdate(
            req.params.id,
            { 
                refundAmount,
                refundStatus,
                returnStatus: 'approved'
            },
            { new: true }
        );
        
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        
        order.statusHistory.push({
            status: 'refund_processed',
            timestamp: new Date(),
            note: `Refund of ₹${refundAmount} processed`
        });
        
        await order.save();
        res.status(200).json(order);
    } catch (err) {
        console.error('Error processing refund:', err);
        res.status(500).json(err);
    }
});

// Notify seller
router.put('/notify-seller/:id', async (req, res) => {
    try {
        const order = await Model.findByIdAndUpdate(
            req.params.id,
            { 
                sellerNotified: true,
                sellerNotifiedAt: new Date()
            },
            { new: true }
        );
        
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        
        // Here you would send actual notification to seller (email, SMS, push notification)
        // For now, just update the database
        
        res.status(200).json(order);
    } catch (err) {
        console.error('Error notifying seller:', err);
        res.status(500).json(err);
    }
});

// Get order tracking details
router.get('/tracking/:id', async (req, res) => {
    try {
        const order = await Model.findById(req.params.id)
            .populate('user', 'fname lname email');
        
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        
        const trackingInfo = {
            orderId: order._id,
            status: order.status,
            tracking: order.tracking,
            statusHistory: order.statusHistory,
            courierDetails: order.courierDetails,
            estimatedDeliveryDate: order.estimatedDeliveryDate,
            deliveredAt: order.deliveredAt,
            shippingAddress: order.shippingAddress
        };
        
        res.status(200).json(trackingInfo);
    } catch (err) {
        console.error('Error fetching tracking details:', err);
        res.status(500).json(err);
    }
});

module.exports = router;