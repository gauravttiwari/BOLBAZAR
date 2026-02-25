"use client";
import React, { useEffect, useState } from "react";
import useVoiceContext from "@/context/VoiceContext";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import useAppContext from "@/context/AppContext";


const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
import ClientOnly from "@/components/ClientOnly";

  const OrderTrackingContent = () => {
    // All hooks and logic from the original OrderTracking component
    const { voiceResponse } = useVoiceContext();
    const searchParams = useSearchParams();
    const orderId = searchParams.get("orderId");
    const { currentUser } = useAppContext();
    const [order, setOrder] = useState(null);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);

    useEffect(() => {
      const fetchData = async () => {
        setLoading(true);
        try {
          if (orderId) {
            const response = await fetch(`${API_URL}/order/getbyid/${orderId}`);
            if (response.ok) {
              const data = await response.json();
              setOrder(data);
              setSelectedOrder(data);
            }
          } else if (currentUser?._id) {
            const response = await fetch(`${API_URL}/order/getbyuser/${currentUser._id}`);
            if (response.ok) {
              const data = await response.json();
              setOrders(data);
              if (data.length > 0) {
                setSelectedOrder(data[0]);
              }
            }
          }
        } catch (err) {
          console.error("Error fetching orders:", err);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }, [orderId, currentUser?._id]);

    const handleCancelOrder = async () => {
      if (!selectedOrder?._id) return;
      try {
        const response = await fetch(`${API_URL}/order/cancel/${selectedOrder._id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
        });
        if (response.ok) {
          const updated = { ...selectedOrder, status: "cancelled" };
          setSelectedOrder(updated);
          setOrder(updated);
          setOrders((prev) => prev.map((o) => (o._id === updated._id ? updated : o)));
          voiceResponse && voiceResponse("Order cancelled successfully.");
          alert("Order cancelled successfully.");
        } else {
          voiceResponse && voiceResponse("Failed to cancel order.");
          alert("Failed to cancel order.");
        }
      } catch (err) {
        voiceResponse && voiceResponse("Error cancelling order.");
        alert("Error cancelling order.");
      }
    };

    useEffect(() => {
      const listener = () => {
        handleCancelOrder();
      };
      window.addEventListener("voiceCancelOrder", listener);
      return () => window.removeEventListener("voiceCancelOrder", listener);
    }, [selectedOrder]);

    const formatDate = (dateString) => {
      return new Date(dateString).toLocaleDateString("en-IN", {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    };

    const formatTime = (dateString) => {
      return new Date(dateString).toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
      });
    };

    const getEstimatedDelivery = (createdAt, status) => {
      const created = new Date(createdAt);
      const estimated = new Date(created);
      estimated.setDate(estimated.getDate() + 5);
      if (status === "delivered") {
        return "Delivered";
      }
      return formatDate(estimated);
    };

    const statusSteps = [
      { key: "placed", label: "Order Placed", icon: "📦" },
      { key: "processing", label: "Processing", icon: "⚙️" },
      { key: "shipped", label: "Shipped", icon: "🚚" },
      { key: "out_for_delivery", label: "Out for Delivery", icon: "🛵" },
      { key: "delivered", label: "Delivered", icon: "✅" },
    ];

    const getStatusIndex = (status) => {
      const statusMap = {
        placed: 0,
        processing: 1,
        shipped: 2,
        out_for_delivery: 3,
        delivered: 4,
        cancelled: -1,
      };
      return statusMap[status] || 0;
    };

    const currentStatusIndex = selectedOrder ? getStatusIndex(selectedOrder.status) : 0;

    if (loading) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
        </div>
      );
    }

    if (!selectedOrder && !orders.length) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <h2 className="text-2xl font-bold text-gray-700">No Orders Found</h2>
            <p className="text-gray-500 mt-2">You haven't placed any orders yet.</p>
            <Link href="/productView">
              <button className="mt-4 px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
                Start Shopping
              </button>
            </Link>
          </div>
        </div>
      );
    }


    // Render full order details UI
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
            <Link href="/" className="hover:text-emerald-600">Home</Link>
            <span>/</span>
            <Link href="/user/profile" className="hover:text-emerald-600">My Account</Link>
            <span>/</span>
            <span className="text-gray-900">Order Tracking</span>
          </nav>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Order List Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-4 border-b border-gray-200 bg-gray-50">
                  <h2 className="font-semibold text-gray-900">My Orders</h2>
                </div>
                <div className="max-h-[600px] overflow-y-auto">
                  {(orderId ? [order] : orders).filter(Boolean).map((o) => (
                    <div
                      key={o._id}
                      onClick={() => setSelectedOrder(o)}
                      className={`p-4 border-b border-gray-100 cursor-pointer transition-colors ${
                        selectedOrder?._id === o._id ? "bg-emerald-50 border-l-4 border-l-emerald-600" : "hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <span className="font-mono text-xs text-gray-500">#{o._id?.slice(-8).toUpperCase()}</span>
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                          o.status === "delivered" ? "bg-green-100 text-green-700" :
                          o.status === "cancelled" ? "bg-red-100 text-red-700" :
                          "bg-blue-100 text-blue-700"
                        }`}>
                          {o.status?.charAt(0).toUpperCase() + o.status?.slice(1)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-800 font-medium truncate">
                        {o.items?.[0]?.pname || "Order Items"}
                        {o.items?.length > 1 && ` +${o.items.length - 1} more`}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">{formatDate(o.createdAt)}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Order Details */}
            <div className="lg:col-span-2 space-y-6">
              {selectedOrder && (
                <>
                  {/* Order Header */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
                      <div>
                        <h1 className="text-xl font-bold text-gray-900">Order Details</h1>
                        <p className="text-gray-500 mt-1">
                          Order ID: <span className="font-mono font-medium">#{selectedOrder._id?.slice(-8).toUpperCase()}</span>
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">Placed on</p>
                        <p className="font-medium text-gray-900">{formatDate(selectedOrder.createdAt)}</p>
                      </div>
                    </div>

                    {/* Status Cancelled */}
                    {selectedOrder.status === "cancelled" ? (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </div>
                          <div>
                            <h3 className="font-semibold text-red-800">Order Cancelled</h3>
                            <p className="text-sm text-red-600">This order has been cancelled.</p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* Progress Tracker */
                      <div className="relative">
                        {/* Progress Line */}
                        <div className="absolute top-6 left-0 right-0 h-1 bg-gray-200 mx-8">
                          <div
                            className="h-full bg-emerald-500 transition-all duration-500"
                            style={{ width: `${(currentStatusIndex / 4) * 100}%` }}
                          ></div>
                        </div>

                        {/* Status Steps */}
                        <div className="relative flex justify-between">
                          {statusSteps.map((step, index) => {
                            const isCompleted = index <= currentStatusIndex;
                            const isCurrent = index === currentStatusIndex;
                            
                            return (
                              <div key={step.key} className="flex flex-col items-center">
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl z-10 transition-all ${
                                  isCompleted
                                    ? "bg-emerald-500 text-white shadow-lg shadow-emerald-200"
                                    : "bg-gray-100 text-gray-400"
                                } ${isCurrent ? "ring-4 ring-emerald-100" : ""}`}>
                                  {isCompleted ? (index === currentStatusIndex ? step.icon : "✓") : step.icon}
                                </div>
                                <p className={`mt-2 text-xs font-medium text-center ${
                                  isCompleted ? "text-emerald-600" : "text-gray-400"
                                }`}>
                                  {step.label}
                                </p>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Delivery Info Card */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Expected Delivery</p>
                          <p className="font-semibold text-gray-900">{getEstimatedDelivery(selectedOrder.createdAt, selectedOrder.status)}</p>
                        </div>
                      </div>
                      {selectedOrder.status !== "delivered" && selectedOrder.status !== "cancelled" && (
                        <p className="text-sm text-gray-500">
                          Your order will be delivered by <span className="font-medium text-emerald-600">BolBazar Delivery</span>
                        </p>
                      )}
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Delivery Address</p>
                          <p className="font-semibold text-gray-900">{selectedOrder.shippingAddress?.name || currentUser?.fname}</p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600">
                        {selectedOrder.shippingAddress?.address || "Address will be shown here"}
                        {selectedOrder.shippingAddress?.city && `, ${selectedOrder.shippingAddress.city}`}
                        {selectedOrder.shippingAddress?.pincode && ` - ${selectedOrder.shippingAddress.pincode}`}
                      </p>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="p-4 border-b border-gray-200 bg-gray-50">
                      <h3 className="font-semibold text-gray-900">Items in this order</h3>
                    </div>
                    <div className="divide-y divide-gray-100">
                      {selectedOrder.items?.map((item, idx) => (
                        <div key={idx} className="p-4 flex gap-4">
                          <div className="w-20 h-20 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden">
                            {item.image ? (
                              <img src={item.image} alt={item.pname} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                </svg>
                              </div>
                            )}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">{item.pname}</h4>
                            <p className="text-sm text-gray-500 mt-1">
                              Quantity: {item.quantity || 1}
                              {item.color && ` • Color: ${item.color}`}
                              {item.size && ` • Size: ${item.size}`}
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                              <span className="text-lg font-bold text-gray-900">₹{item.price ?? item.pprice ?? 0}</span>
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            {selectedOrder.status === "delivered" && (
                              <Link href={`/productDetail/${item.productId}`}>
                                <button className="px-3 py-1.5 text-sm bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 transition-colors">
                                  Buy Again
                                </button>
                              </Link>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Order Summary */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Payment Summary</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Subtotal</span>
                        <span className="text-gray-900">₹{((selectedOrder.paymentDetails?.amount || 0) / 100).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Delivery Charges</span>
                        <span className="text-gray-900">
                          ₹{selectedOrder.deliveryCharge !== undefined ? selectedOrder.deliveryCharge.toFixed(2) : "0.00"}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Discount</span>
                        <span className="text-green-600">-₹{selectedOrder.discount !== undefined ? selectedOrder.discount.toFixed(2) : "0.00"}</span>
                      </div>
                      <hr className="my-3" />
                      <div className="flex justify-between">
                        <span className="font-semibold text-gray-900">Total Amount</span>
                        <span className="text-xl font-bold text-emerald-600">
                          ₹{
                            (
                              ((selectedOrder.paymentDetails?.amount || 0) / 100) +
                              (selectedOrder.deliveryCharge || 0) -
                              (selectedOrder.discount || 0)
                            ).toFixed(2)
                          }
                        </span>
                      </div>
                      <div className="mt-4 p-3 bg-green-50 rounded-lg flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-sm text-green-700">
                          {selectedOrder.paymentDetails?.payment_method_types?.[0] === "cod" || selectedOrder.paymentMethod === "cod" || selectedOrder.paymentMethod === "COD"
                            ? "Cash on Delivery"
                            : `Paid via ${selectedOrder.paymentDetails?.payment_method_types?.[0]?.charAt(0).toUpperCase() + selectedOrder.paymentDetails?.payment_method_types?.[0]?.slice(1) || "Card"}`}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-4">
                    <button className="flex-1 min-w-[150px] px-6 py-3 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Need Help?
                    </button>
                    <button className="flex-1 min-w-[150px] px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      Download Invoice
                    </button>
                    {/* Cancel Order Button: show if not delivered/cancelled */}
                    {selectedOrder.status !== "delivered" && selectedOrder.status !== "cancelled" && (
                      <button
                        className="flex-1 min-w-[150px] px-6 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                        onClick={handleCancelOrder}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Cancel Order
                      </button>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    );
}

const OrderTracking = () => (
  <ClientOnly>
    <OrderTrackingContent />
  </ClientOnly>
);

export default OrderTracking;
