"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import useSellerContext from "@/context/SellerContext";
import SellerSidebar from "@/components/SellerSidebar";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const NotificationsPage = () => {
  const { currentSeller, sellerReady } = useSellerContext();
  const router = useRouter();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // all, unread, orders, products

  useEffect(() => {
    if (sellerReady && !currentSeller) {
      router.push("/sellerLogin");
    }
  }, [sellerReady, currentSeller, router]);

  // Generate notifications from orders and other activities
  useEffect(() => {
    const fetchNotifications = async () => {
      if (!currentSeller?._id) return;

      setLoading(true);
      try {
        // Fetch orders for this seller
        const ordersRes = await fetch(`${API_URL}/order/getbyseller/${currentSeller._id}`);
        const ordersData = ordersRes.ok ? await ordersRes.json() : [];

        // Fetch products for this seller
        const productsRes = await fetch(`${API_URL}/product/getbyseller/${currentSeller._id}`);
        const productsData = productsRes.ok ? await productsRes.json() : [];

        // Generate notifications from orders
        const orderNotifications = ordersData.slice(0, 10).map((order) => ({
          id: `order-${order._id}`,
          type: "order",
          title: order.status === "pending" ? "New Order Received" : `Order ${order.status}`,
          message: `Order #${order._id.slice(-6).toUpperCase()} - ₹${order.totalAmount || 0}`,
          time: new Date(order.createdAt),
          read: order.status !== "pending",
          icon: "order",
          link: "/seller/manageorder",
        }));

        // Generate product notifications
        const productNotifications = productsData.slice(0, 5).map((product) => {
          const createdAt = new Date(product.createdAt);
          const isNew = (Date.now() - createdAt.getTime()) < 24 * 60 * 60 * 1000; // Less than 24 hours
          return {
            id: `product-${product._id}`,
            type: "product",
            title: isNew ? "Product Listed Successfully" : "Product Active",
            message: `${product.pname} is now live on your store`,
            time: createdAt,
            read: !isNew,
            icon: "product",
            link: "/seller/manageProduct",
          };
        });

        // Add some system notifications
        const systemNotifications = [
          {
            id: "welcome",
            type: "system",
            title: "Welcome to BolBazar!",
            message: "Your seller account is active. Start adding products to grow your business.",
            time: new Date(currentSeller.createdAt || Date.now()),
            read: true,
            icon: "system",
            link: "/seller/sellerdashboard",
          },
        ];

        // If there are pending orders, add an urgent notification
        const pendingOrders = ordersData.filter(o => o.status === "pending");
        if (pendingOrders.length > 0) {
          systemNotifications.unshift({
            id: "pending-orders",
            type: "system",
            title: "Action Required",
            message: `You have ${pendingOrders.length} pending order${pendingOrders.length > 1 ? 's' : ''} to process`,
            time: new Date(),
            read: false,
            icon: "alert",
            link: "/seller/manageorder",
          });
        }

        // Combine and sort all notifications
        const allNotifications = [...orderNotifications, ...productNotifications, ...systemNotifications].sort(
          (a, b) => b.time - a.time
        );

        setNotifications(allNotifications);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      } finally {
        setLoading(false);
      }
    };

    if (currentSeller?._id) {
      fetchNotifications();
    }
  }, [currentSeller]);

  const markAsRead = (id) => {
    setNotifications(notifications.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  const filteredNotifications = notifications.filter((n) => {
    if (filter === "all") return true;
    if (filter === "unread") return !n.read;
    if (filter === "orders") return n.type === "order";
    if (filter === "products") return n.type === "product";
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  const getIcon = (iconType) => {
    switch (iconType) {
      case "order":
        return (
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-blue-600">
              <path d="M3.375 3C2.339 3 1.5 3.84 1.5 4.875v.75c0 1.036.84 1.875 1.875 1.875h17.25c1.035 0 1.875-.84 1.875-1.875v-.75C22.5 3.839 21.66 3 20.625 3H3.375z" />
              <path fillRule="evenodd" d="M3.087 9l.54 9.176A3 3 0 006.62 21h10.757a3 3 0 002.995-2.824L20.913 9H3.087zm6.163 3.75A.75.75 0 0110 12h4a.75.75 0 010 1.5h-4a.75.75 0 01-.75-.75z" clipRule="evenodd" />
            </svg>
          </div>
        );
      case "product":
        return (
          <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-emerald-600">
              <path fillRule="evenodd" d="M7.5 6v.75H5.513c-.96 0-1.764.724-1.865 1.679l-1.263 12A1.875 1.875 0 004.25 22.5h15.5a1.875 1.875 0 001.865-2.071l-1.263-12a1.875 1.875 0 00-1.865-1.679H16.5V6a4.5 4.5 0 10-9 0zM12 3a3 3 0 00-3 3v.75h6V6a3 3 0 00-3-3zm-3 8.25a3 3 0 106 0v-.75a.75.75 0 011.5 0v.75a4.5 4.5 0 11-9 0v-.75a.75.75 0 011.5 0v.75z" clipRule="evenodd" />
            </svg>
          </div>
        );
      case "alert":
        return (
          <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-orange-600">
              <path fillRule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
            </svg>
          </div>
        );
      default:
        return (
          <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-purple-600">
              <path fillRule="evenodd" d="M5.25 9a6.75 6.75 0 0113.5 0v.75c0 2.123.8 4.057 2.118 5.52a.75.75 0 01-.297 1.206c-1.544.57-3.16.99-4.831 1.243a3.75 3.75 0 11-7.48 0 24.585 24.585 0 01-4.831-1.244.75.75 0 01-.298-1.205A8.217 8.217 0 005.25 9.75V9zm4.502 8.9a2.25 2.25 0 104.496 0 25.057 25.057 0 01-4.496 0z" clipRule="evenodd" />
            </svg>
          </div>
        );
    }
  };

  const formatTime = (date) => {
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString("en-IN", { month: "short", day: "numeric" });
  };

  if (!sellerReady) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  if (!currentSeller) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <SellerSidebar />

      {/* Main Content */}
      <div className="p-4 xl:ml-80">
        {/* Header */}
        <div className="mb-8">
          <nav aria-label="breadcrumb" className="w-max">
            <ol className="flex flex-wrap items-center w-full bg-opacity-60 rounded-md bg-transparent p-0 transition-all">
              <li className="flex items-center">
                <Link href="/seller/sellerdashboard" className="text-gray-500 hover:text-emerald-600">
                  Dashboard
                </Link>
                <span className="text-gray-500 mx-2">/</span>
              </li>
              <li className="flex items-center">
                <span className="text-gray-900 font-semibold">Notifications</span>
              </li>
            </ol>
          </nav>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mt-2 gap-4">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
              {unreadCount > 0 && (
                <span className="bg-red-500 text-white text-sm px-2 py-0.5 rounded-full">
                  {unreadCount} new
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-1"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path fillRule="evenodd" d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z" clipRule="evenodd" />
                </svg>
                Mark all as read
              </button>
            )}
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-md p-4 mb-6">
          <div className="flex flex-wrap gap-2">
            {[
              { key: "all", label: "All" },
              { key: "unread", label: "Unread" },
              { key: "orders", label: "Orders" },
              { key: "products", label: "Products" },
            ].map((f) => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === f.key
                    ? "bg-emerald-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {f.label}
                {f.key === "unread" && unreadCount > 0 && (
                  <span className="ml-2 bg-white/20 px-1.5 rounded text-sm">{unreadCount}</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Notifications List */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-16 h-16 mx-auto text-gray-300 mb-4"
            >
              <path
                fillRule="evenodd"
                d="M5.25 9a6.75 6.75 0 0113.5 0v.75c0 2.123.8 4.057 2.118 5.52a.75.75 0 01-.297 1.206c-1.544.57-3.16.99-4.831 1.243a3.75 3.75 0 11-7.48 0 24.585 24.585 0 01-4.831-1.244.75.75 0 01-.298-1.205A8.217 8.217 0 005.25 9.75V9zm4.502 8.9a2.25 2.25 0 104.496 0 25.057 25.057 0 01-4.496 0z"
                clipRule="evenodd"
              />
            </svg>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">No notifications</h3>
            <p className="text-gray-500">
              {filter === "unread" ? "You're all caught up!" : "Notifications will appear here"}
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            {filteredNotifications.map((notification, index) => (
              <Link
                key={notification.id}
                href={notification.link}
                onClick={() => markAsRead(notification.id)}
                className={`flex items-start gap-4 p-4 hover:bg-gray-50 transition-colors ${
                  !notification.read ? "bg-emerald-50/50" : ""
                } ${index !== filteredNotifications.length - 1 ? "border-b border-gray-100" : ""}`}
              >
                {getIcon(notification.icon)}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className={`font-medium ${!notification.read ? "text-gray-900" : "text-gray-700"}`}>
                        {notification.title}
                      </h4>
                      <p className="text-sm text-gray-500 mt-0.5">{notification.message}</p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-xs text-gray-400">{formatTime(notification.time)}</span>
                      {!notification.read && (
                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Summary Card */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl shadow-md p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-blue-600">
                  <path d="M3.375 3C2.339 3 1.5 3.84 1.5 4.875v.75c0 1.036.84 1.875 1.875 1.875h17.25c1.035 0 1.875-.84 1.875-1.875v-.75C22.5 3.839 21.66 3 20.625 3H3.375z" />
                  <path fillRule="evenodd" d="M3.087 9l.54 9.176A3 3 0 006.62 21h10.757a3 3 0 002.995-2.824L20.913 9H3.087z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-500">Order Notifications</p>
                <p className="text-lg font-bold text-gray-900">
                  {notifications.filter((n) => n.type === "order").length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-emerald-600">
                  <path fillRule="evenodd" d="M7.5 6v.75H5.513c-.96 0-1.764.724-1.865 1.679l-1.263 12A1.875 1.875 0 004.25 22.5h15.5a1.875 1.875 0 001.865-2.071l-1.263-12a1.875 1.875 0 00-1.865-1.679H16.5V6a4.5 4.5 0 10-9 0zM12 3a3 3 0 00-3 3v.75h6V6a3 3 0 00-3-3zm-3 8.25a3 3 0 106 0v-.75a.75.75 0 011.5 0v.75a4.5 4.5 0 11-9 0v-.75a.75.75 0 011.5 0v.75z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-500">Product Notifications</p>
                <p className="text-lg font-bold text-gray-900">
                  {notifications.filter((n) => n.type === "product").length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-purple-600">
                  <path fillRule="evenodd" d="M5.25 9a6.75 6.75 0 0113.5 0v.75c0 2.123.8 4.057 2.118 5.52a.75.75 0 01-.297 1.206c-1.544.57-3.16.99-4.831 1.243a3.75 3.75 0 11-7.48 0 24.585 24.585 0 01-4.831-1.244.75.75 0 01-.298-1.205A8.217 8.217 0 005.25 9.75V9zm4.502 8.9a2.25 2.25 0 104.496 0 25.057 25.057 0 01-4.496 0z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-500">System Notifications</p>
                <p className="text-lg font-bold text-gray-900">
                  {notifications.filter((n) => n.type === "system").length}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;
