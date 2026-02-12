"use client";
import { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export default function ReportsAnalytics() {
  const [dateRange, setDateRange] = useState('30days');
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchAnalytics();
  }, [dateRange]);

  const fetchAnalytics = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/admin/charts');
      const data = await res.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    }
  };

  const revenueChartData = {
    labels: stats?.daily?.map(d => new Date(d.date).toLocaleDateString().slice(0, 5)) || [],
    datasets: [{
      label: 'Revenue',
      data: stats?.daily?.map(d => d.revenue) || [],
      borderColor: 'rgb(34, 197, 94)',
      backgroundColor: 'rgba(34, 197, 94, 0.1)',
      fill: true,
    }]
  };

  const ordersChartData = {
    labels: stats?.daily?.map(d => new Date(d.date).toLocaleDateString().slice(0, 5)) || [],
    datasets: [{
      label: 'Orders',
      data: stats?.daily?.map(d => d.orders) || [],
      backgroundColor: 'rgba(59, 130, 246, 0.7)',
    }]
  };

  const categoryData = {
    labels: ['Electronics', 'Fashion', 'Home', 'Books', 'Sports'],
    datasets: [{
      data: [30, 25, 20, 15, 10],
      backgroundColor: [
        'rgba(59, 130, 246, 0.7)',
        'rgba(34, 197, 94, 0.7)',
        'rgba(234, 179, 8, 0.7)',
        'rgba(239, 68, 68, 0.7)',
        'rgba(168, 85, 247, 0.7)'
      ]
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: { color: '#fff' }
      }
    },
    scales: {
      y: {
        ticks: { color: '#9ca3af' },
        grid: { color: 'rgba(255, 255, 255, 0.1)' }
      },
      x: {
        ticks: { color: '#9ca3af' },
        grid: { color: 'rgba(255, 255, 255, 0.1)' }
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">📊 Reports & Analytics</h1>
            <p className="text-gray-400">Comprehensive business insights and reports</p>
          </div>
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-4 py-2 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
            <option value="90days">Last 90 Days</option>
            <option value="year">This Year</option>
          </select>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <button className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-4 text-white text-left hover:shadow-lg transition">
            <div className="text-sm mb-2">📥 Export Sales Report</div>
            <div className="text-xs text-blue-100">Download detailed sales data</div>
          </button>
          <button className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-4 text-white text-left hover:shadow-lg transition">
            <div className="text-sm mb-2">📋 Generate Invoice Report</div>
            <div className="text-xs text-green-100">Export invoices for accounting</div>
          </button>
          <button className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-4 text-white text-left hover:shadow-lg transition">
            <div className="text-sm mb-2">📊 Customer Analytics</div>
            <div className="text-xs text-purple-100">View customer behavior insights</div>
          </button>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Revenue Trend */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4">💰 Revenue Trend</h3>
            <div className="h-64">
              <Line data={revenueChartData} options={chartOptions} />
            </div>
          </div>

          {/* Orders Trend */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4">📦 Orders Trend</h3>
            <div className="h-64">
              <Bar data={ordersChartData} options={chartOptions} />
            </div>
          </div>

          {/* Category Distribution */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4">📊 Sales by Category</h3>
            <div className="h-64 flex items-center justify-center">
              <Doughnut data={categoryData} options={{ ...chartOptions, scales: undefined }} />
            </div>
          </div>

          {/* Top Products */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4">🏆 Top 5 Products</h3>
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-600 rounded"></div>
                    <div>
                      <div className="text-white text-sm font-medium">Product Name {i}</div>
                      <div className="text-gray-400 text-xs">Category</div>
                    </div>
                  </div>
                  <div className="text-emerald-400 font-semibold">₹{Math.floor(Math.random() * 50000)}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Detailed Stats Table */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">📈 Detailed Performance Metrics</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-gray-700 rounded-lg">
              <div className="text-gray-400 text-xs mb-1">Conversion Rate</div>
              <div className="text-white text-2xl font-bold">3.2%</div>
              <div className="text-green-400 text-xs mt-1">↑ 0.5%</div>
            </div>
            <div className="p-4 bg-gray-700 rounded-lg">
              <div className="text-gray-400 text-xs mb-1">Avg Order Value</div>
              <div className="text-white text-2xl font-bold">₹2,450</div>
              <div className="text-green-400 text-xs mt-1">↑ ₹150</div>
            </div>
            <div className="p-4 bg-gray-700 rounded-lg">
              <div className="text-gray-400 text-xs mb-1">Customer Retention</div>
              <div className="text-white text-2xl font-bold">67%</div>
              <div className="text-red-400 text-xs mt-1">↓ 2%</div>
            </div>
            <div className="p-4 bg-gray-700 rounded-lg">
              <div className="text-gray-400 text-xs mb-1">Return Rate</div>
              <div className="text-white text-2xl font-bold">4.1%</div>
              <div className="text-green-400 text-xs mt-1">↓ 0.3%</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
