"use client";
import React, { useEffect, useState } from 'react';
import { IconPackage, IconTruck, IconCheck, IconX, IconClock } from '@tabler/icons-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const SellerOrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userData = sessionStorage.getItem("seller");
      if (userData) {
        try {
          const user = JSON.parse(userData);
          setCurrentUser(user);
          loadOrders(user._id);
        } catch (error) {
          console.error("Error parsing user data:", error);
        }
      }
      setLoading(false);
    }
  }, []);

  const loadOrders = async (sellerId) => {
    try {
      const response = await fetch(`${API_URL}/order/getbyseller/${sellerId}`);
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      }
    } catch (error) {
      console.error("Error loading orders:", error);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const messages = {
        'processing': 'Order is being processed',
        'shipped': 'Order has been shipped',
        'out_for_delivery': 'Order is out for delivery',
        'delivered': 'Order has been delivered'
      };

      const response = await fetch(`${API_URL}/order/update-status/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: newStatus,
          message: messages[newStatus]
        })
      });

      if (response.ok) {
        const updatedOrder = await response.json();
        setOrders(orders.map(order => 
          order._id === orderId ? updatedOrder : order
        ));
        setSelectedOrder(updatedOrder);
        alert('Order status updated successfully!');
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      alert("Failed to update order status");
    }
  };

  const addCourierDetails = async (orderId) => {
    const courierName = prompt("Enter courier name:");
    const trackingNumber = prompt("Enter tracking number:");
    const awbNumber = prompt("Enter AWB number:");

    if (!courierName || !trackingNumber) {
      alert("Courier name and tracking number are required");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/order/add-courier-details/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courierName,
          trackingNumber,
          awbNumber
        })
      });

      if (response.ok) {
        const updatedOrder = await response.json();
        setOrders(orders.map(order => 
          order._id === orderId ? updatedOrder : order
        ));
        alert('Courier details added successfully!');
      }
    } catch (error) {
      console.error("Error adding courier details:", error);
      alert("Failed to add courier details");
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'placed': 'bg-blue-100 text-blue-700',
      'processing': 'bg-yellow-100 text-yellow-700',
      'shipped': 'bg-purple-100 text-purple-700',
      'out_for_delivery': 'bg-indigo-100 text-indigo-700',
      'delivered': 'bg-green-100 text-green-700',
      'cancelled': 'bg-red-100 text-red-700',
      'return_requested': 'bg-orange-100 text-orange-700'
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  const getStatusIcon = (status) => {
    const icons = {
      'placed': <IconClock size={16} />,
      'processing': <IconClock size={16} />,
      'shipped': <IconTruck size={16} />,
      'out_for_delivery': <IconTruck size={16} />,
      'delivered': <IconCheck size={16} />,
      'cancelled': <IconX size={16} />
    };
    return icons[status] || <IconPackage size={16} />;
  };

  const filteredOrders = filterStatus === 'all' 
    ? orders 
    : orders.filter(order => order.status === filterStatus);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Order Management</h1>
        <p className="text-gray-600 mt-2">Manage and track your orders</p>
      </div>

      {/* Filter Tabs */}
      <div className="mb-6 flex gap-2 flex-wrap">
        {[
          { key: 'all', label: 'All Orders' },
          { key: 'placed', label: 'New' },
          { key: 'processing', label: 'Processing' },
          { key: 'shipped', label: 'Shipped' },
          { key: 'delivered', label: 'Delivered' }
        ].map((filter) => (
          <button
            key={filter.key}
            onClick={() => setFilterStatus(filter.key)}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              filterStatus === filter.key
                ? 'bg-emerald-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {filter.label}
            {filter.key !== 'all' && (
              <span className="ml-2 px-2 py-0.5 bg-white/20 rounded-full text-xs">
                {orders.filter(o => o.status === filter.key).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Orders Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Orders List */}
        <div className="lg:col-span-2 space-y-4">
          {filteredOrders.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
              <IconPackage size={48} className="mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-semibold text-gray-700">No orders found</h3>
              <p className="text-gray-500 mt-2">
                {filterStatus === 'all' 
                  ? 'You have no orders yet' 
                  : `No orders with status: ${filterStatus}`}
              </p>
            </div>
          ) : (
            filteredOrders.map((order) => (
              <div
                key={order._id}
                onClick={() => setSelectedOrder(order)}
                className={`bg-white rounded-xl shadow-sm border ${
                  selectedOrder?._id === order._id
                    ? 'border-emerald-500 ring-2 ring-emerald-100'
                    : 'border-gray-200'
                } p-6 cursor-pointer hover:shadow-md transition-all`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-mono font-semibold text-gray-900">
                        #{order._id?.slice(-8).toUpperCase()}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)}
                        {order.status?.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Total</p>
                    <p className="text-xl font-bold text-gray-900">
                      ₹{order.sellerTotal || order.totalAmount || 0}
                    </p>
                  </div>
                </div>

                {/* Order Items Preview */}
                <div className="space-y-2">
                  {order.items?.slice(0, 2).map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3 text-sm">
                      <div className="w-10 h-10 bg-gray-100 rounded flex-shrink-0"></div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-700 line-clamp-1">{item.pname}</p>
                        <p className="text-gray-500">Qty: {item.quantity || 1}</p>
                      </div>
                      <p className="font-semibold text-gray-900">₹{item.pprice}</p>
                    </div>
                  ))}
                  {order.items?.length > 2 && (
                    <p className="text-sm text-gray-500">
                      +{order.items.length - 2} more items
                    </p>
                  )}
                </div>

                {/* Customer Info */}
                {order.user && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <p className="text-sm text-gray-600">
                      Customer: <span className="font-medium text-gray-900">
                        {order.user.fname} {order.user.lname}
                      </span>
                    </p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Order Details Sidebar */}
        <div className="lg:col-span-1">
          {selectedOrder ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-4">
              <h3 className="font-bold text-lg mb-4">Order Actions</h3>

              {/* Status Update Buttons */}
              <div className="space-y-3">
                {selectedOrder.status === 'placed' && (
                  <button
                    onClick={() => updateOrderStatus(selectedOrder._id, 'processing')}
                    className="w-full bg-yellow-500 text-white py-2 rounded-lg hover:bg-yellow-600 transition-all font-medium"
                  >
                    Start Processing
                  </button>
                )}

                {selectedOrder.status === 'processing' && (
                  <>
                    <button
                      onClick={() => addCourierDetails(selectedOrder._id)}
                      className="w-full bg-purple-500 text-white py-2 rounded-lg hover:bg-purple-600 transition-all font-medium"
                    >
                      Add Courier Details & Ship
                    </button>
                    <button
                      onClick={() => updateOrderStatus(selectedOrder._id, 'shipped')}
                      className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-all font-medium"
                    >
                      Mark as Shipped
                    </button>
                  </>
                )}

                {selectedOrder.status === 'shipped' && (
                  <button
                    onClick={() => updateOrderStatus(selectedOrder._id, 'out_for_delivery')}
                    className="w-full bg-indigo-500 text-white py-2 rounded-lg hover:bg-indigo-600 transition-all font-medium"
                  >
                    Out for Delivery
                  </button>
                )}

                {selectedOrder.status === 'out_for_delivery' && (
                  <button
                    onClick={() => updateOrderStatus(selectedOrder._id, 'delivered')}
                    className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition-all font-medium"
                  >
                    Mark as Delivered
                  </button>
                )}

                {selectedOrder.status === 'delivered' && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center gap-2">
                      <IconCheck className="text-green-600" />
                      <span className="font-medium text-green-700">Order Completed</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Courier Details */}
              {selectedOrder.courierDetails && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h4 className="font-semibold mb-3">Courier Details</h4>
                  <div className="space-y-2 text-sm">
                    <p><span className="text-gray-500">Courier:</span> <span className="font-medium">{selectedOrder.courierDetails.courierName}</span></p>
                    <p><span className="text-gray-500">Tracking:</span> <span className="font-mono font-medium">{selectedOrder.courierDetails.trackingNumber}</span></p>
                    {selectedOrder.courierDetails.awbNumber && (
                      <p><span className="text-gray-500">AWB:</span> <span className="font-mono font-medium">{selectedOrder.courierDetails.awbNumber}</span></p>
                    )}
                  </div>
                </div>
              )}

              {/* Shipping Address */}
              {selectedOrder.shippingAddress && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h4 className="font-semibold mb-3">Shipping Address</h4>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p className="font-medium text-gray-900">{selectedOrder.shippingAddress.name}</p>
                    <p>{selectedOrder.shippingAddress.address}</p>
                    {selectedOrder.shippingAddress.locality && <p>{selectedOrder.shippingAddress.locality}</p>}
                    <p>{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state}</p>
                    <p>{selectedOrder.shippingAddress.pincode}</p>
                    <p className="mt-2">📱 {selectedOrder.shippingAddress.mobile}</p>
                  </div>
                </div>
              )}

              {/* Payment Info */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="font-semibold mb-3">Payment Details</h4>
                <div className="space-y-2 text-sm">
                  <p><span className="text-gray-500">Method:</span> <span className="font-medium uppercase">{selectedOrder.paymentMethod || selectedOrder.mode}</span></p>
                  <p><span className="text-gray-500">Amount:</span> <span className="font-bold text-lg text-emerald-600">₹{selectedOrder.sellerTotal || selectedOrder.totalAmount || 0}</span></p>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
              <IconPackage size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">Select an order to view details and actions</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SellerOrderManagement;
