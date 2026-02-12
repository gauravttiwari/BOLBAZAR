"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useAppContext from "@/context/AppContext";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const UserProfile = () => {
  const router = useRouter();
  const { currentUser, setCurrentUser, setLoggedIn, loading: authLoading } = useAppContext();
  const [profileData, setProfileData] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("profile");

  // Check auth after context has finished loading
  useEffect(() => {
    if (authLoading) return;
    
    if (!currentUser) {
      router.push("/login");
      return;
    }
  }, [authLoading, currentUser, router]);

  const getUserInfo = async () => {
    if (!currentUser?.token) return;
    
    try {
      const response = await fetch(`${API_URL}/user/getbyid`, {
        headers: {
          "x-auth-token": currentUser.token,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setProfileData(data);
      }
    } catch (err) {
      console.error("Error fetching user info:", err);
    }
  };

  const getUserOrders = async () => {
    if (!currentUser?._id) return;
    
    try {
      const response = await fetch(`${API_URL}/order/getbyuser/${currentUser._id}`);
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      }
    } catch (err) {
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser) {
      getUserInfo();
      getUserOrders();
    }
  }, [currentUser]);

  const handleLogout = () => {
    sessionStorage.removeItem("user");
    setCurrentUser(null);
    setLoggedIn(false);
    router.push("/login");
  };

  // Show loading while checking authentication
  if (authLoading || !currentUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      placed: "bg-blue-100 text-blue-800",
      processing: "bg-yellow-100 text-yellow-800",
      shipped: "bg-purple-100 text-purple-800",
      delivered: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 h-48 relative">
        <div className="absolute inset-0 bg-black/20"></div>
      </div>

      <div className="max-w-6xl mx-auto px-4 -mt-24 relative z-10 pb-12">
        {/* Profile Card */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Profile Header */}
          <div className="p-6 sm:p-8 flex flex-col sm:flex-row items-center sm:items-end gap-4">
            <div className="w-32 h-32 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center text-white text-5xl font-bold shadow-lg border-4 border-white -mt-16 sm:-mt-20">
              {currentUser?.fname?.charAt(0).toUpperCase() || "U"}
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                {currentUser?.fname} {currentUser?.lname}
              </h1>
              <p className="text-gray-500 mt-1">{currentUser?.email}</p>
            </div>
            <div className="flex gap-3">
              <Link href="/user/editprofile">
                <button className="px-5 py-2.5 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit Profile
                </button>
              </Link>
              <button 
                onClick={handleLogout}
                className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-t border-gray-200">
            <div className="flex">
              <button
                onClick={() => setActiveTab("profile")}
                className={`flex-1 py-4 text-center font-medium transition-colors ${
                  activeTab === "profile"
                    ? "text-emerald-600 border-b-2 border-emerald-600 bg-emerald-50/50"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Profile Details
              </button>
              <button
                onClick={() => setActiveTab("orders")}
                className={`flex-1 py-4 text-center font-medium transition-colors ${
                  activeTab === "orders"
                    ? "text-emerald-600 border-b-2 border-emerald-600 bg-emerald-50/50"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                My Orders ({orders.length})
              </button>
              <button
                onClick={() => setActiveTab("addresses")}
                className={`flex-1 py-4 text-center font-medium transition-colors ${
                  activeTab === "addresses"
                    ? "text-emerald-600 border-b-2 border-emerald-600 bg-emerald-50/50"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Addresses
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-6 sm:p-8">
            {/* Profile Tab */}
            {activeTab === "profile" && (
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <label className="text-sm text-gray-500">First Name</label>
                    <p className="text-gray-900 font-medium">{profileData?.fname || currentUser?.fname}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <label className="text-sm text-gray-500">Last Name</label>
                    <p className="text-gray-900 font-medium">{profileData?.lname || currentUser?.lname}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <label className="text-sm text-gray-500">Email Address</label>
                    <p className="text-gray-900 font-medium">{profileData?.email || currentUser?.email}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Statistics</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-emerald-50 rounded-lg p-4 text-center">
                      <p className="text-3xl font-bold text-emerald-600">{orders.length}</p>
                      <p className="text-sm text-gray-600">Total Orders</p>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-4 text-center">
                      <p className="text-3xl font-bold text-blue-600">
                        {orders.filter(o => o.status === "delivered").length}
                      </p>
                      <p className="text-sm text-gray-600">Delivered</p>
                    </div>
                    <div className="bg-yellow-50 rounded-lg p-4 text-center">
                      <p className="text-3xl font-bold text-yellow-600">
                        {orders.filter(o => o.status === "processing" || o.status === "shipped").length}
                      </p>
                      <p className="text-sm text-gray-600">In Progress</p>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-4 text-center">
                      <p className="text-3xl font-bold text-purple-600">0</p>
                      <p className="text-sm text-gray-600">Wishlist Items</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Orders Tab */}
            {activeTab === "orders" && (
              <div className="space-y-4">
                {loading ? (
                  <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
                  </div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-12">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    <h3 className="text-lg font-medium text-gray-700">No orders yet</h3>
                    <p className="text-gray-500 mt-1">Start shopping to see your orders here!</p>
                    <Link href="/productView">
                      <button className="mt-4 px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
                        Browse Products
                      </button>
                    </Link>
                  </div>
                ) : (
                  orders.map((order) => (
                    <div key={order._id} className="border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                      <div className="p-4 bg-gray-50 border-b border-gray-200 flex flex-wrap gap-4 justify-between items-center">
                        <div className="flex gap-6 text-sm">
                          <div>
                            <span className="text-gray-500">Order ID: </span>
                            <span className="font-mono font-medium">#{order._id?.slice(-8).toUpperCase()}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Placed on: </span>
                            <span className="font-medium">{formatDate(order.createdAt)}</span>
                          </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                          {order.status?.charAt(0).toUpperCase() + order.status?.slice(1)}
                        </span>
                      </div>
                      <div className="p-4">
                        {order.items?.map((item, idx) => (
                          <div key={idx} className="flex items-center gap-4 py-2">
                            <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                              {item.image ? (
                                <img src={item.image} alt={item.pname} className="w-full h-full object-cover rounded-lg" />
                              ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                </svg>
                              )}
                            </div>
                            <div className="flex-1">
                              <p className="font-medium text-gray-900">{item.pname}</p>
                              <p className="text-sm text-gray-500">Qty: {item.quantity || 1}</p>
                            </div>
                            <p className="font-semibold text-gray-900">₹{item.price || 0}</p>
                          </div>
                        ))}
                      </div>
                      <div className="p-4 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
                        <div className="text-sm">
                          <span className="text-gray-500">Total: </span>
                          <span className="text-lg font-bold text-gray-900">
                            ₹{(order.paymentDetails?.amount / 100) || 0}
                          </span>
                        </div>
                        <Link href={`/user/ordertracking?orderId=${order._id}`}>
                          <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors">
                            Track Order
                          </button>
                        </Link>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Addresses Tab */}
            {activeTab === "addresses" && (
              <div className="text-center py-12">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <h3 className="text-lg font-medium text-gray-700">No saved addresses</h3>
                <p className="text-gray-500 mt-1">Add addresses for faster checkout</p>
                <button className="mt-4 px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
                  Add New Address
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
