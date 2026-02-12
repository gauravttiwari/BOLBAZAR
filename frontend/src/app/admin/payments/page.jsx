"use client";
import { useState, useEffect } from 'react';

export default function PaymentsRefunds() {
  const [payments, setPayments] = useState([]);
  const [refunds, setRefunds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('payments');

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const res = await fetch('http://localhost:5000/order/getall');
      const data = await res.json();
      setPayments(data.filter(order => order.paymentStatus === 'paid'));
      setRefunds(data.filter(order => order.paymentStatus === 'refunded'));
      setLoading(false);
    } catch (error) {
      console.error('Error fetching payments:', error);
      setLoading(false);
    }
  };

  const handleRefund = async (orderId) => {
    if (confirm('Are you sure you want to process this refund?')) {
      try {
        await fetch(`http://localhost:5000/order/refund/${orderId}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        });
        fetchPayments();
      } catch (error) {
        console.error('Error processing refund:', error);
      }
    }
  };

  const totalRevenue = payments.reduce((sum, p) => sum + (p.totalAmount || 0), 0);
  const totalRefunded = refunds.reduce((sum, r) => sum + (r.totalAmount || 0), 0);

  if (loading) return <div className="text-white p-8">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">💰 Payments & Refunds</h1>
          <p className="text-gray-400">Manage payment transactions and refund requests</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-6">
            <h3 className="text-white text-sm font-semibold mb-2">Total Revenue</h3>
            <p className="text-white text-3xl font-bold">₹{totalRevenue.toLocaleString()}</p>
          </div>
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6">
            <h3 className="text-white text-sm font-semibold mb-2">Total Payments</h3>
            <p className="text-white text-3xl font-bold">{payments.length}</p>
          </div>
          <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-lg p-6">
            <h3 className="text-white text-sm font-semibold mb-2">Total Refunded</h3>
            <p className="text-white text-3xl font-bold">₹{totalRefunded.toLocaleString()}</p>
          </div>
          <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg p-6">
            <h3 className="text-white text-sm font-semibold mb-2">Refund Requests</h3>
            <p className="text-white text-3xl font-bold">{refunds.length}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-gray-800 rounded-lg p-2 mb-6 flex gap-2">
          <button
            onClick={() => setActiveTab('payments')}
            className={`flex-1 px-4 py-3 rounded-lg font-medium transition ${
              activeTab === 'payments'
                ? 'bg-emerald-600 text-white'
                : 'text-gray-300 hover:bg-gray-700'
            }`}
          >
            💳 All Payments ({payments.length})
          </button>
          <button
            onClick={() => setActiveTab('refunds')}
            className={`flex-1 px-4 py-3 rounded-lg font-medium transition ${
              activeTab === 'refunds'
                ? 'bg-emerald-600 text-white'
                : 'text-gray-300 hover:bg-gray-700'
            }`}
          >
            ↩️ Refund Requests ({refunds.length})
          </button>
        </div>

        {/* Table */}
        <div className="bg-gray-800 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Transaction ID</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Payment Method</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {(activeTab === 'payments' ? payments : refunds).map((transaction) => (
                  <tr key={transaction._id} className="hover:bg-gray-700 transition">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-white">
                      #{transaction._id?.slice(-12)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                      {transaction.user?.name || transaction.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-white">
                      ₹{transaction.totalAmount?.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-500/20 text-blue-300">
                        {transaction.paymentMethod || 'Card'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {new Date(transaction.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {activeTab === 'payments' ? (
                        <button
                          onClick={() => handleRefund(transaction._id)}
                          className="text-red-400 hover:text-red-300"
                        >
                          Process Refund
                        </button>
                      ) : (
                        <span className="text-green-400">✓ Refunded</span>
                      )}
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
