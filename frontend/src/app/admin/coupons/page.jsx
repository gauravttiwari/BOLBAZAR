"use client";
import { useState, useEffect } from 'react';

export default function CouponsOffers() {
  const [coupons, setCoupons] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    code: '',
    discount: '',
    type: 'percentage',
    minOrder: '',
    maxDiscount: '',
    expiryDate: '',
    usageLimit: ''
  });

  useEffect(() => {
    // Mock data - Replace with actual API call
    setCoupons([
      { _id: '1', code: 'WELCOME10', discount: 10, type: 'percentage', usageCount: 45, usageLimit: 100, active: true },
      { _id: '2', code: 'SAVE500', discount: 500, type: 'fixed', usageCount: 23, usageLimit: 50, active: true },
      { _id: '3', code: 'FLAT20', discount: 20, type: 'percentage', usageCount: 78, usageLimit: 200, active: false }
    ]);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add coupon logic here
    console.log('Creating coupon:', formData);
    setShowAddForm(false);
  };

  const toggleCouponStatus = (id) => {
    setCoupons(coupons.map(coupon => 
      coupon._id === id ? { ...coupon, active: !coupon.active } : coupon
    ));
  };

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">🎟 Offers & Coupons</h1>
            <p className="text-gray-400">Create and manage discount coupons</p>
          </div>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition font-semibold"
          >
            + Create New Coupon
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6">
            <h3 className="text-white text-sm font-semibold mb-2">Total Coupons</h3>
            <p className="text-white text-3xl font-bold">{coupons.length}</p>
          </div>
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-6">
            <h3 className="text-white text-sm font-semibold mb-2">Active Coupons</h3>
            <p className="text-white text-3xl font-bold">{coupons.filter(c => c.active).length}</p>
          </div>
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-6">
            <h3 className="text-white text-sm font-semibold mb-2">Total Uses</h3>
            <p className="text-white text-3xl font-bold">{coupons.reduce((sum, c) => sum + c.usageCount, 0)}</p>
          </div>
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg p-6">
            <h3 className="text-white text-sm font-semibold mb-2">Discount Given</h3>
            <p className="text-white text-3xl font-bold">₹12.5K</p>
          </div>
        </div>

        {/* Add Coupon Form */}
        {showAddForm && (
          <div className="bg-gray-800 rounded-lg p-6 mb-6">
            <h2 className="text-xl font-bold text-white mb-4">Create New Coupon</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Coupon Code (e.g., SAVE10)"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                className="px-4 py-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="px-4 py-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="percentage">Percentage (%)</option>
                <option value="fixed">Fixed Amount (₹)</option>
              </select>
              <input
                type="number"
                placeholder={`Discount ${formData.type === 'percentage' ? '(%)' : '(₹)'}`}
                value={formData.discount}
                onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                className="px-4 py-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
              <input
                type="number"
                placeholder="Minimum Order Value (₹)"
                value={formData.minOrder}
                onChange={(e) => setFormData({ ...formData, minOrder: e.target.value })}
                className="px-4 py-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <input
                type="date"
                placeholder="Expiry Date"
                value={formData.expiryDate}
                onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                className="px-4 py-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <input
                type="number"
                placeholder="Usage Limit"
                value={formData.usageLimit}
                onChange={(e) => setFormData({ ...formData, usageLimit: e.target.value })}
                className="px-4 py-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <div className="md:col-span-2 flex gap-3">
                <button type="submit" className="flex-1 px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition font-semibold">
                  Create Coupon
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Coupons List */}
        <div className="bg-gray-800 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Coupon Code</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Discount</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Usage</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {coupons.map((coupon) => (
                  <tr key={coupon._id} className="hover:bg-gray-700 transition">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 font-mono font-bold text-sm rounded">
                        {coupon.code}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white font-semibold">
                      {coupon.type === 'percentage' ? `${coupon.discount}%` : `₹${coupon.discount}`}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-500/20 text-blue-300">
                        {coupon.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                      {coupon.usageCount} / {coupon.usageLimit}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        coupon.active ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'
                      }`}>
                        {coupon.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => toggleCouponStatus(coupon._id)}
                        className="text-blue-400 hover:text-blue-300 mr-3"
                      >
                        {coupon.active ? 'Deactivate' : 'Activate'}
                      </button>
                      <button className="text-red-400 hover:text-red-300">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
