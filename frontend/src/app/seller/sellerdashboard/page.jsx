"use client";
import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import useSellerContext from "@/context/SellerContext";
import SellerSidebar from "@/components/SellerSidebar";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// Stat Card Component
const StatCard = ({ title, value, change, changeType, icon, gradient }) => (
  <div className="relative flex flex-col bg-clip-border rounded-xl bg-white text-gray-700 shadow-md hover:shadow-lg transition-shadow duration-300">
    <div
      className={`bg-clip-border mx-4 rounded-xl overflow-hidden ${gradient} text-white shadow-lg absolute -mt-4 grid h-16 w-16 place-items-center`}
    >
      {icon}
    </div>
    <div className="p-4 text-right">
      <p className="block antialiased font-sans text-sm leading-normal font-normal text-blue-gray-600">
        {title}
      </p>
      <h4 className="block antialiased tracking-normal font-sans text-2xl font-semibold leading-snug text-blue-gray-900">
        {value}
      </h4>
    </div>
    <div className="border-t border-blue-gray-50 p-4">
      <p className="block antialiased font-sans text-base leading-relaxed font-normal text-blue-gray-600">
        <strong className={changeType === "positive" ? "text-green-500" : changeType === "negative" ? "text-red-500" : "text-gray-500"}>
          {changeType === "positive" ? "+" : changeType === "negative" ? "" : ""}
          {change}
        </strong>
        &nbsp;than last period
      </p>
    </div>
  </div>
);

// Order Status Badge Component
const StatusBadge = ({ status }) => {
  const statusStyles = {
    placed: "bg-blue-100 text-blue-800",
    processing: "bg-yellow-100 text-yellow-800",
    shipped: "bg-purple-100 text-purple-800",
    delivered: "bg-green-100 text-green-800",
    completed: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
  };

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusStyles[status] || "bg-gray-100 text-gray-800"}`}>
      {status?.charAt(0).toUpperCase() + status?.slice(1)}
    </span>
  );
};

const SellerDashboard = () => {
  console.log("📊 Seller Dashboard component loaded");
  const { currentSeller, sellerReady } = useSellerContext();
  console.log("Current seller:", currentSeller);
  console.log("Seller ready:", sellerReady);
  const [stats, setStats] = useState(null);
  const [products, setProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [chartView, setChartView] = useState("sales"); // sales, orders, or combined

  // Fetch dashboard data
  const fetchDashboardData = useCallback(async () => {
    if (!currentSeller?._id) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const [statsRes, productsRes, reviewsRes] = await Promise.all([
        fetch(`${API_URL}/order/seller-stats/${currentSeller._id}`),
        fetch(`${API_URL}/product/getbyseller/${currentSeller._id}`),
        fetch(`${API_URL}/review/getall`),
      ]);

      if (!statsRes.ok) throw new Error("Failed to fetch statistics");

      const statsData = await statsRes.json();
      const productsData = productsRes.ok ? await productsRes.json() : [];
      const allReviews = reviewsRes.ok ? await reviewsRes.json() : [];
      
      // Filter reviews for seller's products
      const sellerProductIds = productsData.map(p => p._id);
      const sellerReviews = allReviews.filter(review => 
        sellerProductIds.includes(review.product)
      );

      setStats(statsData);
      setProducts(productsData);
      setReviews(sellerReviews);
      setLastUpdated(new Date());
      setError(null);
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [currentSeller?._id]);

  // Initial fetch and auto-refresh
  useEffect(() => {
    if (sellerReady) {
      fetchDashboardData();
    }

    // Auto-refresh every 30 seconds
    let interval;
    if (autoRefresh && currentSeller?._id) {
      interval = setInterval(fetchDashboardData, 30000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [fetchDashboardData, autoRefresh, sellerReady, currentSeller?._id]);

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  // Format date for chart
  const formatChartDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-IN", { month: "short", day: "numeric" });
  };

  // Prepare chart data
  const chartData = stats?.chartData?.map((item) => ({
    ...item,
    date: formatChartDate(item.date),
  })) || [];

  // Calculate average rating
  const averageRating = reviews.length > 0 
    ? (reviews.reduce((sum, review) => sum + (review.rating || 0), 0) / reviews.length).toFixed(1)
    : "0.0";

  // Calculate pending payments (20% commission on pending/processing orders)
  const pendingPayments = ((stats?.pendingOrders || 0) * 0.8 * (stats?.todayRevenue || 0) / (stats?.todayOrders || 1)) || 0;

  // Find low stock products (stock < 10)
  const lowStockProducts = products.filter(p => (p.pstock || 0) < 10);

  // Calculate best selling products from recent orders
  const productSales = {};
  stats?.recentOrders?.forEach(order => {
    order.items?.forEach(item => {
      if (!productSales[item.pid]) {
        productSales[item.pid] = {
          pid: item.pid,
          pname: item.pname,
          quantity: 0,
          revenue: 0
        };
      }
      productSales[item.pid].quantity += item.quantity || 1;
      productSales[item.pid].revenue += (item.pprice * (item.quantity || 1));
    });
  });
  const bestSellingProducts = Object.values(productSales)
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 5);

  // Pie chart data for order status
  const orderStatusData = [
    { name: "Pending", value: stats?.pendingOrders || 0, color: "#f59e0b" },
    { name: "Completed", value: stats?.completedOrders || 0, color: "#10b981" },
    { name: "Other", value: (stats?.totalOrders || 0) - (stats?.pendingOrders || 0) - (stats?.completedOrders || 0), color: "#6b7280" },
  ].filter(item => item.value > 0);

  // Icons
  const icons = {
    money: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <path d="M12 7.5a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5z" />
        <path fillRule="evenodd" d="M1.5 4.875C1.5 3.839 2.34 3 3.375 3h17.25c1.035 0 1.875.84 1.875 1.875v9.75c0 1.036-.84 1.875-1.875 1.875H3.375A1.875 1.875 0 011.5 14.625v-9.75zM8.25 9.75a3.75 3.75 0 117.5 0 3.75 3.75 0 01-7.5 0zM18.75 9a.75.75 0 00-.75.75v.008c0 .414.336.75.75.75h.008a.75.75 0 00.75-.75V9.75a.75.75 0 00-.75-.75h-.008zM4.5 9.75A.75.75 0 015.25 9h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75H5.25a.75.75 0 01-.75-.75V9.75z" clipRule="evenodd" />
      </svg>
    ),
    orders: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <path fillRule="evenodd" d="M7.5 6v.75H5.513c-.96 0-1.764.724-1.865 1.679l-1.263 12A1.875 1.875 0 004.25 22.5h15.5a1.875 1.875 0 001.865-2.071l-1.263-12a1.875 1.875 0 00-1.865-1.679H16.5V6a4.5 4.5 0 10-9 0zM12 3a3 3 0 00-3 3v.75h6V6a3 3 0 00-3-3zm-3 8.25a3 3 0 106 0v-.75a.75.75 0 011.5 0v.75a4.5 4.5 0 11-9 0v-.75a.75.75 0 011.5 0v.75z" clipRule="evenodd" />
      </svg>
    ),
    products: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <path fillRule="evenodd" d="M3 6a3 3 0 013-3h2.25a3 3 0 013 3v2.25a3 3 0 01-3 3H6a3 3 0 01-3-3V6zm9.75 0a3 3 0 013-3H18a3 3 0 013 3v2.25a3 3 0 01-3 3h-2.25a3 3 0 01-3-3V6zM3 15.75a3 3 0 013-3h2.25a3 3 0 013 3V18a3 3 0 01-3 3H6a3 3 0 01-3-3v-2.25zm9.75 0a3 3 0 013-3H18a3 3 0 013 3V18a3 3 0 01-3 3h-2.25a3 3 0 01-3-3v-2.25z" clipRule="evenodd" />
      </svg>
    ),
    items: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <path d="M18.375 2.25c-1.035 0-1.875.84-1.875 1.875v15.75c0 1.035.84 1.875 1.875 1.875h.75c1.035 0 1.875-.84 1.875-1.875V4.125c0-1.036-.84-1.875-1.875-1.875h-.75zM9.75 8.625c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v11.25c0 1.035-.84 1.875-1.875 1.875h-.75a1.875 1.875 0 01-1.875-1.875V8.625zM3 13.125c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v6.75c0 1.035-.84 1.875-1.875 1.875h-.75A1.875 1.875 0 013 19.875v-6.75z" />
      </svg>
    ),
    growth: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <path fillRule="evenodd" d="M15.22 6.268a.75.75 0 01.968-.432l5.942 2.28a.75.75 0 01.431.97l-2.28 5.941a.75.75 0 11-1.4-.537l1.63-4.251-1.086.483a11.2 11.2 0 00-5.45 5.174.75.75 0 01-1.199.19L9 12.31l-6.22 6.22a.75.75 0 11-1.06-1.06l6.75-6.75a.75.75 0 011.06 0l3.606 3.605a12.694 12.694 0 015.68-4.973l1.086-.484-4.251-1.631a.75.75 0 01-.432-.97z" clipRule="evenodd" />
      </svg>
    ),
    pending: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 000-1.5h-3.75V6z" clipRule="evenodd" />
      </svg>
    ),
    star: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
      </svg>
    ),
    wallet: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <path d="M2.273 5.625A4.483 4.483 0 015.25 4.5h13.5c1.141 0 2.183.425 2.977 1.125A3 3 0 0018.75 3H5.25a3 3 0 00-2.977 2.625zM2.273 8.625A4.483 4.483 0 015.25 7.5h13.5c1.141 0 2.183.425 2.977 1.125A3 3 0 0018.75 6H5.25a3 3 0 00-2.977 2.625zM5.25 9a3 3 0 00-3 3v6a3 3 0 003 3h13.5a3 3 0 003-3v-6a3 3 0 00-3-3H15a.75.75 0 00-.75.75 2.25 2.25 0 01-4.5 0A.75.75 0 009 9H5.25z" />
      </svg>
    ),
  };

  // Show loading while checking for seller session
  if (!sellerReady) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  if (!currentSeller) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-lg text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Please Login</h2>
          <p className="text-gray-600 mb-4">You need to be logged in to view your dashboard.</p>
          <Link href="/sellerLogin" className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition-colors">
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <SellerSidebar />

      {/* Main Content */}
      <div className="p-4 xl:ml-80">
        {/* Header */}
        <nav className="block w-full max-w-full bg-transparent text-white shadow-none rounded-xl transition-all px-0 py-1">
          <div className="flex flex-col-reverse justify-between gap-6 md:flex-row md:items-center">
            <div className="capitalize">
              <nav aria-label="breadcrumb" className="w-max">
                <ol className="flex flex-wrap items-center w-full bg-opacity-60 rounded-md bg-transparent p-0 transition-all">
                  <li className="flex items-center text-blue-gray-900 antialiased font-sans text-sm font-normal leading-normal cursor-pointer transition-colors duration-300 hover:text-light-blue-500">
                    <span className="text-gray-500">Dashboard</span>
                    <span className="text-gray-500 text-sm antialiased font-sans font-normal leading-normal mx-2 pointer-events-none select-none">/</span>
                  </li>
                  <li className="flex items-center text-blue-900 antialiased font-sans text-sm font-normal leading-normal cursor-pointer transition-colors duration-300 hover:text-blue-500">
                    <span className="text-gray-900 font-semibold">Analytics</span>
                  </li>
                </ol>
              </nav>
              <h6 className="block antialiased tracking-normal font-sans text-base font-semibold leading-relaxed text-gray-900">
                Welcome back, {currentSeller?.fname || "Seller"}!
              </h6>
            </div>
            <div className="flex items-center gap-4">
              {/* Auto-refresh toggle */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Auto-refresh</span>
                <button
                  onClick={() => setAutoRefresh(!autoRefresh)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${autoRefresh ? "bg-emerald-600" : "bg-gray-300"}`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${autoRefresh ? "translate-x-6" : "translate-x-1"}`} />
                </button>
              </div>
              {/* Manual refresh button */}
              <button
                onClick={fetchDashboardData}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                  <path fillRule="evenodd" d="M4.755 10.059a7.5 7.5 0 0112.548-3.364l1.903 1.903h-3.183a.75.75 0 000 1.5h4.992a.75.75 0 00.75-.75V4.356a.75.75 0 00-1.5 0v3.18l-1.9-1.9A9 9 0 003.306 9.67a.75.75 0 101.45.388zm15.408 3.352a.75.75 0 00-.919.53 7.5 7.5 0 01-12.548 3.364l-1.902-1.903h3.183a.75.75 0 000-1.5H2.984a.75.75 0 00-.75.75v4.992a.75.75 0 001.5 0v-3.18l1.9 1.9a9 9 0 0015.059-4.035.75.75 0 00-.53-.918z" clipRule="evenodd" />
                </svg>
                Refresh
              </button>
              {lastUpdated && (
                <span className="text-xs text-gray-500">
                  Last updated: {lastUpdated.toLocaleTimeString()}
                </span>
              )}
            </div>
          </div>
        </nav>

        {/* Loading State */}
        {loading && (
          <div className="mt-12 flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="mt-12 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center gap-2 text-red-800">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
              </svg>
              <span>Error loading dashboard: {error}</span>
            </div>
          </div>
        )}

        {/* Stats Content */}
        {!loading && !error && (
          <>
            {/* Stats Cards */}
            <div className="mt-12">
              <div className="mb-12 grid gap-y-10 gap-x-6 md:grid-cols-2 xl:grid-cols-6">
                <StatCard
                  title="Today's Revenue"
                  value={formatCurrency(stats?.todayRevenue)}
                  change={`${stats?.dayGrowth || 0}%`}
                  changeType={stats?.dayGrowth >= 0 ? "positive" : "negative"}
                  icon={icons.money}
                  gradient="bg-gradient-to-tr from-emerald-600 to-emerald-400 shadow-emerald-500/40"
                />
                <StatCard
                  title="Total Orders"
                  value={stats?.totalOrders || 0}
                  change={`${stats?.todayOrders || 0} today`}
                  changeType="neutral"
                  icon={icons.orders}
                  gradient="bg-gradient-to-tr from-pink-600 to-pink-400 shadow-pink-500/40"
                />
                <StatCard
                  title="Total Products"
                  value={products.length}
                  change={`${lowStockProducts.length} low stock`}
                  changeType={lowStockProducts.length > 0 ? "negative" : "neutral"}
                  icon={icons.products}
                  gradient="bg-gradient-to-tr from-blue-600 to-blue-400 shadow-blue-500/40"
                />
                <StatCard
                  title="Average Rating"
                  value={`${averageRating} ⭐`}
                  change={`${reviews.length} reviews`}
                  changeType="neutral"
                  icon={icons.star}
                  gradient="bg-gradient-to-tr from-yellow-600 to-yellow-400 shadow-yellow-500/40"
                />
                <StatCard
                  title="Pending Orders"
                  value={stats?.pendingOrders || 0}
                  change={`${((stats?.pendingOrders / (stats?.totalOrders || 1)) * 100).toFixed(0)}% of total`}
                  changeType="neutral"
                  icon={icons.pending}
                  gradient="bg-gradient-to-tr from-orange-600 to-orange-400 shadow-orange-500/40"
                />
                <StatCard
                  title="Pending Payments"
                  value={formatCurrency(pendingPayments)}
                  change="Settlement due"
                  changeType="neutral"
                  icon={icons.wallet}
                  gradient="bg-gradient-to-tr from-purple-600 to-purple-400 shadow-purple-500/40"
                />
              </div>
            </div>

            {/* Charts Section */}
            <div className="mb-12 grid gap-y-10 gap-x-6 md:grid-cols-2 xl:grid-cols-3">
              {/* Sales Line Chart */}
              <div className="col-span-2 bg-white rounded-xl shadow-md p-6">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">Sales Overview</h3>
                    <p className="text-sm text-gray-500">Last 30 days performance</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setChartView("sales")}
                      className={`px-3 py-1 rounded-lg text-sm ${chartView === "sales" ? "bg-emerald-600 text-white" : "bg-gray-100 text-gray-600"}`}
                    >
                      Revenue
                    </button>
                    <button
                      onClick={() => setChartView("orders")}
                      className={`px-3 py-1 rounded-lg text-sm ${chartView === "orders" ? "bg-emerald-600 text-white" : "bg-gray-100 text-gray-600"}`}
                    >
                      Orders
                    </button>
                    <button
                      onClick={() => setChartView("combined")}
                      className={`px-3 py-1 rounded-lg text-sm ${chartView === "combined" ? "bg-emerald-600 text-white" : "bg-gray-100 text-gray-600"}`}
                    >
                      Combined
                    </button>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  {chartView === "sales" ? (
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#9ca3af" />
                      <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" />
                      <Tooltip
                        contentStyle={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: "8px" }}
                        formatter={(value) => [formatCurrency(value), "Revenue"]}
                      />
                      <Area type="monotone" dataKey="sales" stroke="#10b981" fill="url(#salesGradient)" strokeWidth={2} />
                    </AreaChart>
                  ) : chartView === "orders" ? (
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#9ca3af" />
                      <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" />
                      <Tooltip
                        contentStyle={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: "8px" }}
                        formatter={(value) => [value, "Orders"]}
                      />
                      <Bar dataKey="orders" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  ) : (
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#9ca3af" />
                      <YAxis yAxisId="left" tick={{ fontSize: 12 }} stroke="#10b981" />
                      <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} stroke="#8b5cf6" />
                      <Tooltip
                        contentStyle={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: "8px" }}
                        formatter={(value, name) => [name === "sales" ? formatCurrency(value) : value, name === "sales" ? "Revenue" : "Orders"]}
                      />
                      <Legend />
                      <Line yAxisId="left" type="monotone" dataKey="sales" stroke="#10b981" strokeWidth={2} dot={false} name="Revenue" />
                      <Line yAxisId="right" type="monotone" dataKey="orders" stroke="#8b5cf6" strokeWidth={2} dot={false} name="Orders" />
                    </LineChart>
                  )}
                </ResponsiveContainer>
              </div>

              {/* Order Status Pie Chart */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Order Status</h3>
                <p className="text-sm text-gray-500 mb-4">Current order breakdown</p>
                {orderStatusData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={orderStatusData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {orderStatusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-48 text-gray-400">
                    No order data available
                  </div>
                )}
                <div className="flex justify-center gap-4 mt-4">
                  {orderStatusData.map((item, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                      <span className="text-sm text-gray-600">{item.name}: {item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Performance Metrics */}
            <div className="mb-12 grid gap-y-10 gap-x-6 md:grid-cols-3">
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">Weekly Growth</h3>
                  <span className={`text-2xl font-bold ${(stats?.weekGrowth || 0) >= 0 ? "text-green-500" : "text-red-500"}`}>
                    {(stats?.weekGrowth || 0) >= 0 ? "+" : ""}{stats?.weekGrowth || 0}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${(stats?.weekGrowth || 0) >= 0 ? "bg-green-500" : "bg-red-500"}`}
                    style={{ width: `${Math.min(Math.abs(stats?.weekGrowth || 0), 100)}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-500 mt-2">Compared to last week</p>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">Monthly Growth</h3>
                  <span className={`text-2xl font-bold ${(stats?.monthGrowth || 0) >= 0 ? "text-green-500" : "text-red-500"}`}>
                    {(stats?.monthGrowth || 0) >= 0 ? "+" : ""}{stats?.monthGrowth || 0}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${(stats?.monthGrowth || 0) >= 0 ? "bg-green-500" : "bg-red-500"}`}
                    style={{ width: `${Math.min(Math.abs(stats?.monthGrowth || 0), 100)}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-500 mt-2">Compared to last month</p>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">Pending Orders</h3>
                  <span className="text-2xl font-bold text-amber-500">{stats?.pendingOrders || 0}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="h-2 rounded-full bg-amber-500"
                    style={{ width: `${stats?.totalOrders ? (stats.pendingOrders / stats.totalOrders) * 100 : 0}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-500 mt-2">Awaiting processing</p>
              </div>
            </div>

            {/* Recent Orders Table */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-12">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Recent Orders</h3>
                  <p className="text-sm text-gray-500">Latest 10 orders for your products</p>
                </div>
                <Link
                  href="/seller/manageorder"
                  className="px-4 py-2 text-sm bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                >
                  View All Orders
                </Link>
              </div>
              {stats?.recentOrders && stats.recentOrders.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Order ID</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Products</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Total</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Status</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.recentOrders.map((order) => (
                        <tr key={order._id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-4 text-sm text-gray-800 font-mono">
                            #{order._id.slice(-8).toUpperCase()}
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex flex-col gap-1">
                              {order.items.slice(0, 2).map((item, idx) => (
                                <span key={idx} className="text-sm text-gray-700">
                                  {item.pname} {item.quantity > 1 && `x${item.quantity}`}
                                </span>
                              ))}
                              {order.items.length > 2 && (
                                <span className="text-xs text-gray-500">+{order.items.length - 2} more</span>
                              )}
                            </div>
                          </td>
                          <td className="py-3 px-4 text-sm font-semibold text-gray-800">
                            {formatCurrency(order.total)}
                          </td>
                          <td className="py-3 px-4">
                            <StatusBadge status={order.status} />
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-600">
                            {new Date(order.createdAt).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-12 h-12 mx-auto mb-4">
                    <path d="M2.25 2.25a.75.75 0 000 1.5h1.386c.17 0 .318.114.362.278l2.558 9.592a3.752 3.752 0 00-2.806 3.63c0 .414.336.75.75.75h15.75a.75.75 0 000-1.5H5.378A2.25 2.25 0 017.5 15h11.218a.75.75 0 00.674-.421 60.358 60.358 0 002.96-7.228.75.75 0 00-.525-.965A60.864 60.864 0 005.68 4.509l-.232-.867A1.875 1.875 0 003.636 2.25H2.25zM3.75 20.25a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zM16.5 20.25a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0z" />
                  </svg>
                  <p>No orders yet. Start selling to see your orders here!</p>
                </div>
              )}
            </div>

            {/* Products Overview */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Your Products</h3>
                  <p className="text-sm text-gray-500">{products.length} products listed</p>
                </div>
                <Link
                  href="/seller/addProduct"
                  className="px-4 py-2 text-sm bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                >
                  Add New Product
                </Link>
              </div>
              {products.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {products.slice(0, 6).map((product) => (
                    <div key={product._id} className="border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow">
                      {product.images && product.images[0] ? (
                        <img
                          src={product.images[0].startsWith("http") ? product.images[0] : `${API_URL}/${product.images[0]}`}
                          alt={product.pname}
                          className="w-full h-24 object-cover rounded-lg mb-2"
                        />
                      ) : (
                        <div className="w-full h-24 bg-gray-200 rounded-lg mb-2 flex items-center justify-center">
                          <span className="text-gray-400 text-xs">No Image</span>
                        </div>
                      )}
                      <p className="text-sm font-medium text-gray-800 truncate">{product.pname}</p>
                      <p className="text-sm text-emerald-600 font-semibold">{formatCurrency(product.pprice)}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-12 h-12 mx-auto mb-4">
                    <path fillRule="evenodd" d="M3 6a3 3 0 013-3h2.25a3 3 0 013 3v2.25a3 3 0 01-3 3H6a3 3 0 01-3-3V6zm9.75 0a3 3 0 013-3H18a3 3 0 013 3v2.25a3 3 0 01-3 3h-2.25a3 3 0 01-3-3V6zM3 15.75a3 3 0 013-3h2.25a3 3 0 013 3V18a3 3 0 01-3 3H6a3 3 0 01-3-3v-2.25zm9.75 0a3 3 0 013-3H18a3 3 0 013 3V18a3 3 0 01-3 3h-2.25a3 3 0 01-3-3v-2.25z" clipRule="evenodd" />
                  </svg>
                  <p>No products yet. Add your first product to get started!</p>
                </div>
              )}
              {products.length > 6 && (
                <div className="mt-4 text-center">
                  <Link href="/seller/manageProduct" className="text-emerald-600 hover:text-emerald-700 text-sm font-medium">
                    View all {products.length} products →
                  </Link>
                </div>
              )}
            </div>

            {/* Low Stock Alert */}
            {lowStockProducts.length > 0 && (
              <div className="bg-amber-50 border-l-4 border-amber-500 rounded-xl shadow-md p-6 mb-12">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-amber-500">
                      <path fillRule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-amber-900 mb-2">⚠️ Low Stock Alert</h3>
                    <p className="text-sm text-amber-800 mb-4">
                      {lowStockProducts.length} product{lowStockProducts.length > 1 ? 's' : ''} running low on stock. Update inventory to avoid losing sales.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {lowStockProducts.slice(0, 6).map((product) => (
                        <div key={product._id} className="bg-white rounded-lg p-3 border border-amber-200 flex items-center gap-3">
                          {product.images && product.images[0] ? (
                            <img
                              src={product.images[0].startsWith("http") ? product.images[0] : `${API_URL}/${product.images[0]}`}
                              alt={product.pname}
                              className="w-12 h-12 object-cover rounded"
                            />
                          ) : (
                            <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                              <span className="text-gray-400 text-xs">No Img</span>
                            </div>
                          )}
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-800 truncate">{product.pname}</p>
                            <p className="text-xs text-amber-700 font-semibold">Stock: {product.pstock || 0}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    {lowStockProducts.length > 6 && (
                      <Link href="/seller/manageProduct" className="inline-block mt-4 text-sm text-amber-700 font-medium hover:text-amber-800">
                        View all {lowStockProducts.length} low stock products →
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Best Selling Products & Payment/Earnings Section */}
            <div className="mb-12 grid gap-6 md:grid-cols-2">
              {/* Best Selling Products */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">🏆 Best Selling Products</h3>
                    <p className="text-sm text-gray-500">Top 5 products by quantity sold</p>
                  </div>
                </div>
                {bestSellingProducts.length > 0 ? (
                  <div className="space-y-3">
                    {bestSellingProducts.map((product, index) => (
                      <div key={product.pid} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm ${
                            index === 0 ? 'bg-yellow-100 text-yellow-700' :
                            index === 1 ? 'bg-gray-200 text-gray-700' :
                            index === 2 ? 'bg-orange-100 text-orange-700' :
                            'bg-emerald-100 text-emerald-700'
                          }`}>
                            #{index + 1}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-800">{product.pname}</p>
                            <p className="text-xs text-gray-500">{product.quantity} units sold</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold text-emerald-600">{formatCurrency(product.revenue)}</p>
                          <p className="text-xs text-gray-500">Revenue</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-400">
                    <p className="text-sm">No sales data available yet.</p>
                  </div>
                )}
              </div>

              {/* Payment/Earnings Summary */}
              <div className="bg-gradient-to-br from-emerald-600 to-emerald-400 rounded-xl shadow-md p-6 text-white">
                <div className="flex items-center gap-2 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                    <path d="M2.273 5.625A4.483 4.483 0 015.25 4.5h13.5c1.141 0 2.183.425 2.977 1.125A3 3 0 0018.75 3H5.25a3 3 0 00-2.977 2.625zM2.273 8.625A4.483 4.483 0 015.25 7.5h13.5c1.141 0 2.183.425 2.977 1.125A3 3 0 0018.75 6H5.25a3 3 0 00-2.977 2.625zM5.25 9a3 3 0 00-3 3v6a3 3 0 003 3h13.5a3 3 0 003-3v-6a3 3 0 00-3-3H15a.75.75 0 00-.75.75 2.25 2.25 0 01-4.5 0A.75.75 0 009 9H5.25z" />
                  </svg>
                  <h3 className="text-lg font-semibold">💰 Earnings Summary</h3>
                </div>
                <div className="space-y-4">
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                    <p className="text-sm opacity-90">Total Earnings</p>
                    <p className="text-3xl font-bold mt-1">{formatCurrency(stats?.totalRevenue)}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                      <p className="text-xs opacity-90">Commission (20%)</p>
                      <p className="text-lg font-semibold mt-1">-{formatCurrency((stats?.totalRevenue || 0) * 0.2)}</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                      <p className="text-xs opacity-90">Net Earnings</p>
                      <p className="text-lg font-semibold mt-1">{formatCurrency((stats?.totalRevenue || 0) * 0.8)}</p>
                    </div>
                  </div>
                  <div className="border-t border-white/20 pt-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm opacity-90">Pending Settlement</span>
                      <span className="text-lg font-semibold">{formatCurrency(pendingPayments)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm opacity-90">Completed Orders</span>
                      <span className="text-sm font-medium">{stats?.completedOrders || 0}</span>
                    </div>
                  </div>
                  <Link
                    href="/seller/manageorder"
                    className="block w-full text-center bg-white text-emerald-600 px-4 py-2 rounded-lg font-medium hover:bg-emerald-50 transition-colors mt-4"
                  >
                    View Payment History
                  </Link>
                </div>
              </div>
            </div>

            {/* Footer */}
            <footer className="py-6 mt-8">
              <div className="flex w-full flex-wrap items-center justify-center gap-6 px-2 md:justify-between">
                <p className="block antialiased font-sans text-sm leading-normal font-normal text-gray-600">
                  © 2026 BOLBAZAR - Your Trusted Marketplace
                </p>
                <ul className="flex items-center gap-4">
                  <li>
                    <Link href="/" className="block antialiased font-sans text-sm py-0.5 px-1 font-normal text-gray-600 transition-colors hover:text-emerald-600">
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link href="/about" className="block antialiased font-sans text-sm py-0.5 px-1 font-normal text-gray-600 transition-colors hover:text-emerald-600">
                      About Us
                    </Link>
                  </li>
                  <li>
                    <Link href="/contact" className="block antialiased font-sans text-sm py-0.5 px-1 font-normal text-gray-600 transition-colors hover:text-emerald-600">
                      Contact
                    </Link>
                  </li>
                </ul>
              </div>
            </footer>
          </>
        )}
      </div>
    </div>
  );
};

export default SellerDashboard;
