'use client';
import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// Line Chart for User Growth
export const UserGrowthChart = ({ data }) => {
  const chartData = {
    labels: data.map(item => new Date(item.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })),
    datasets: [
      {
        label: 'New Users',
        data: data.map(item => item.count),
        borderColor: 'rgb(236, 72, 153)',
        backgroundColor: 'rgba(236, 72, 153, 0.1)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
      title: {
        display: true,
        text: 'User Growth (Last 30 Days)',
        font: { size: 16, weight: 'bold' }
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { precision: 0 }
      },
    },
  };

  return <Line data={chartData} options={options} />;
};

// Line Chart for Revenue
export const RevenueChart = ({ data }) => {
  const chartData = {
    labels: data.map(item => new Date(item.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })),
    datasets: [
      {
        label: 'Revenue (₹)',
        data: data.map(item => item.amount),
        borderColor: 'rgb(16, 185, 129)',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
      title: {
        display: true,
        text: 'Revenue Trend (Last 30 Days)',
        font: { size: 16, weight: 'bold' }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            label += '₹' + context.parsed.y.toLocaleString('en-IN');
            return label;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return '₹' + value.toLocaleString('en-IN');
          }
        }
      },
    },
  };

  return <Line data={chartData} options={options} />;
};

// Bar Chart for Orders
export const OrdersChart = ({ data }) => {
  const chartData = {
    labels: data.map(item => new Date(item.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })),
    datasets: [
      {
        label: 'Orders',
        data: data.map(item => item.count),
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
      title: {
        display: true,
        text: 'Orders Per Day (Last 30 Days)',
        font: { size: 16, weight: 'bold' }
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { precision: 0 }
      },
    },
  };

  return <Bar data={chartData} options={options} />;
};

// Doughnut Chart for Order Status
export const OrderStatusChart = ({ data }) => {
  const statusColors = {
    pending: 'rgb(251, 191, 36)',
    processing: 'rgb(59, 130, 246)',
    shipped: 'rgb(139, 92, 246)',
    delivered: 'rgb(16, 185, 129)',
    completed: 'rgb(34, 197, 94)',
    cancelled: 'rgb(239, 68, 68)',
  };

  const chartData = {
    labels: data.map(item => item.status.charAt(0).toUpperCase() + item.status.slice(1)),
    datasets: [
      {
        data: data.map(item => item.count),
        backgroundColor: data.map(item => statusColors[item.status] || 'rgb(156, 163, 175)'),
        borderWidth: 2,
        borderColor: '#fff',
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'right',
      },
      title: {
        display: true,
        text: 'Order Status Distribution',
        font: { size: 16, weight: 'bold' }
      },
    },
  };

  return <Doughnut data={chartData} options={options} />;
};

// Line Chart for Sellers
export const SellersChart = ({ data }) => {
  const chartData = {
    labels: data.map(item => new Date(item.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })),
    datasets: [
      {
        label: 'New Sellers',
        data: data.map(item => item.count),
        borderColor: 'rgb(168, 85, 247)',
        backgroundColor: 'rgba(168, 85, 247, 0.1)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
      title: {
        display: true,
        text: 'Seller Registrations (Last 30 Days)',
        font: { size: 16, weight: 'bold' }
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { precision: 0 }
      },
    },
  };

  return <Line data={chartData} options={options} />;
};

// Bar Chart for Products
export const ProductsChart = ({ data }) => {
  const chartData = {
    labels: data.map(item => new Date(item.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })),
    datasets: [
      {
        label: 'Products Added',
        data: data.map(item => item.count),
        backgroundColor: 'rgba(249, 115, 22, 0.8)',
        borderColor: 'rgb(249, 115, 22)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
      title: {
        display: true,
        text: 'Products Added (Last 30 Days)',
        font: { size: 16, weight: 'bold' }
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { precision: 0 }
      },
    },
  };

  return <Bar data={chartData} options={options} />;
};
