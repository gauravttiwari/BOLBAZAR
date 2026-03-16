const express = require('express');
const router = express.Router();
const User = require('../models/userModel');
const Order = require('../models/orderModel');
const Product = require('../models/productModel');
const Seller = require('../models/sellerModel');

// 📊 Get Chart Data for Graphs
router.get('/admin/charts', async (req, res) => {
    try {
        const today = new Date();
        const last30Days = new Date(today);
        last30Days.setDate(last30Days.getDate() - 30);
        
        // Get last 30 days data for users
        const usersByDay = await User.aggregate([
            {
                $dateToStringmatch: { createdAt: { $gte: last30Days } }
            },
            {
                $group: {
                    _id: { $: { format: "%Y-%m-%d", date: "$createdAt" } },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);
        
        // Get last 30 days revenue data
        const revenueByDay = await Order.aggregate([
            {
                $match: { 
                    createdAt: { $gte: last30Days },
                    status: { $in: ['delivered', 'completed'] }
                }
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    revenue: { $sum: { $ifNull: ["$totalAmount", "$amount"] } },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);
        
        // Get last 30 days orders data
        const ordersByDay = await Order.aggregate([
            {
                $match: { createdAt: { $gte: last30Days } }
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);
        
        // Get products added by day
        const productsByDay = await Product.aggregate([
            {
                $match: { createdAt: { $gte: last30Days } }
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);
        
        // Get sellers registered by day
        const sellersByDay = await Seller.aggregate([
            {
                $match: { createdAt: { $gte: last30Days } }
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);
        
        // Get order status distribution
        const ordersByStatus = await Order.aggregate([
            {
                $group: {
                    _id: "$status",
                    count: { $sum: 1 }
                }
            }
        ]);
        
        res.status(200).json({
            success: true,
            data: {
                users: usersByDay.map(item => ({
                    date: item._id,
                    count: item.count
                })),
                revenue: revenueByDay.map(item => ({
                    date: item._id,
                    amount: item.revenue,
                    orders: item.count
                })),
                orders: ordersByDay.map(item => ({
                    date: item._id,
                    count: item.count
                })),
                products: productsByDay.map(item => ({
                    date: item._id,
                    count: item.count
                })),
                sellers: sellersByDay.map(item => ({
                    date: item._id,
                    count: item.count
                })),
                orderStatus: ordersByStatus.map(item => ({
                    status: item._id || 'pending',
                    count: item.count
                }))
            }
        });
        
    } catch (error) {
        console.error('❌ Chart data error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch chart data',
            error: error.message
        });
    }
});

// 📊 Get Admin Dashboard Statistics
router.get('/admin/stats', async (req, res) => {
    try {
        // Total Users
        const totalUsers = await User.countDocuments();
        
        // Total Sellers
        const totalSellers = await Seller.countDocuments();
        
        // Total Products
        const totalProducts = await Product.countDocuments();
        
        // Total Orders
        const totalOrders = await Order.countDocuments();
        
        // Calculate Total Revenue from all orders
        const completedOrders = await Order.find({ status: { $in: ['delivered', 'completed'] } });
        const totalRevenue = completedOrders.reduce((sum, order) => {
            return sum + (order.totalAmount || order.amount || 0);
        }, 0);
        
        // Today's stats (last 24 hours)
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const todayUsers = await User.countDocuments({ 
            createdAt: { $gte: today } 
        });
        
        const todayOrders = await Order.find({ 
            createdAt: { $gte: today },
            status: { $in: ['delivered', 'completed'] }
        });
        
        const todayRevenue = todayOrders.reduce((sum, order) => {
            return sum + (order.totalAmount || order.amount || 0);
        }, 0);
        
        // Last week stats for comparison
        const lastWeek = new Date();
        lastWeek.setDate(lastWeek.getDate() - 7);
        
        const lastWeekOrders = await Order.find({
            createdAt: { $gte: lastWeek, $lt: today },
            status: { $in: ['delivered', 'completed'] }
        });
        
        const lastWeekRevenue = lastWeekOrders.reduce((sum, order) => {
            return sum + (order.totalAmount || order.amount || 0);
        }, 0);
        
        // Calculate percentage changes
        const revenueChange = lastWeekRevenue > 0 
            ? ((todayRevenue - lastWeekRevenue) / lastWeekRevenue * 100).toFixed(1)
            : 0;
        
        // Recent orders (last 5)
        const recentOrders = await Order.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .populate('user', 'fname lname email');
        
        res.status(200).json({
            success: true,
            data: {
                overview: {
                    totalUsers,
                    totalSellers,
                    totalProducts,
                    totalOrders,
                    totalRevenue
                },
                today: {
                    users: todayUsers,
                    orders: todayOrders.length,
                    revenue: todayRevenue,
                    revenueChange: parseFloat(revenueChange)
                },
                recentOrders: recentOrders.map(order => ({
                    id: order._id,
                    customer: order.user ? `${order.user.fname} ${order.user.lname}` : 'Guest',
                    email: order.user?.email,
                    amount: order.totalAmount || order.amount || 0,
                    status: order.status,
                    date: order.createdAt
                }))
            }
        });
        
    } catch (error) {
        console.error('❌ Dashboard stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch dashboard statistics',
            error: error.message
        });
    }
});

module.exports = router;
