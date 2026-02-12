"use client";
import { useState } from "react";
import Link from "next/link";

const GiftCards = () => {
  const [selectedAmount, setSelectedAmount] = useState(null);
  const [customAmount, setCustomAmount] = useState("");

  const predefinedAmounts = [500, 1000, 2000, 5000, 10000];

  const giftCardDesigns = [
    { id: 1, name: "Birthday Celebration", emoji: "🎂", color: "from-pink-400 to-purple-500" },
    { id: 2, name: "Festival Special", emoji: "🎉", color: "from-yellow-400 to-orange-500" },
    { id: 3, name: "Thank You", emoji: "🙏", color: "from-blue-400 to-indigo-500" },
    { id: 4, name: "Congratulations", emoji: "🎊", color: "from-green-400 to-teal-500" },
  ];

  return (
    <div className="min-h-screen bg-surface py-8">
      <div className="section-container">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">BolBazar Gift Cards</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Give the gift of choice! Let your loved ones choose what they want from thousands of products.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Side - Gift Card Preview */}
          <div>
            <div className="sticky top-24">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Choose a Design</h2>
              <div className="grid grid-cols-2 gap-4 mb-8">
                {giftCardDesigns.map((design) => (
                  <div
                    key={design.id}
                    className="cursor-pointer transform hover:scale-105 transition-transform"
                  >
                    <div className={`bg-gradient-to-br ${design.color} rounded-lg p-6 text-white shadow-lg`}>
                      <div className="text-4xl mb-3">{design.emoji}</div>
                      <p className="font-semibold text-lg">{design.name}</p>
                      <div className="mt-4 text-2xl font-bold">
                        ₹{selectedAmount || customAmount || "---"}
                      </div>
                      <p className="text-sm mt-2 opacity-90">BolBazar Gift Card</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Benefits */}
              <div className="bg-white rounded-lg shadow-card p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Why Choose Gift Cards?</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <span className="text-green-500 mt-1">✓</span>
                    <span className="text-gray-700">Valid on millions of products</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-green-500 mt-1">✓</span>
                    <span className="text-gray-700">No expiry date</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-green-500 mt-1">✓</span>
                    <span className="text-gray-700">Instant email delivery</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-green-500 mt-1">✓</span>
                    <span className="text-gray-700">Multiple payment options</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Right Side - Amount Selection */}
          <div>
            <div className="bg-white rounded-lg shadow-card p-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Select Amount</h2>

              {/* Predefined Amounts */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Choose a predefined amount
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {predefinedAmounts.map((amount) => (
                    <button
                      key={amount}
                      onClick={() => {
                        setSelectedAmount(amount);
                        setCustomAmount("");
                      }}
                      className={`py-3 px-4 rounded-sm font-semibold transition-all ${
                        selectedAmount === amount
                          ? "bg-primary text-white shadow-lg transform scale-105"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      ₹{amount}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Amount */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Or enter a custom amount
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-lg">₹</span>
                  <input
                    type="number"
                    value={customAmount}
                    onChange={(e) => {
                      setCustomAmount(e.target.value);
                      setSelectedAmount(null);
                    }}
                    placeholder="Enter amount"
                    min="100"
                    max="50000"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-sm focus:ring-2 focus:ring-primary/30 focus:border-primary text-lg"
                  />
                </div>
                <p className="text-sm text-gray-500 mt-2">Minimum ₹100, Maximum ₹50,000</p>
              </div>

              {/* Recipient Details */}
              <div className="mb-6 space-y-4">
                <h3 className="font-semibold text-gray-900">Recipient Details</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Recipient Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter recipient's name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:ring-2 focus:ring-primary/30 focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Recipient Email
                  </label>
                  <input
                    type="email"
                    placeholder="Enter recipient's email"
                    className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:ring-2 focus:ring-primary/30 focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Personal Message (Optional)
                  </label>
                  <textarea
                    rows="3"
                    placeholder="Add a personal message..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:ring-2 focus:ring-primary/30 focus:border-primary resize-none"
                  />
                </div>
              </div>

              {/* Buy Button */}
              <button
                disabled={!selectedAmount && !customAmount}
                className="w-full bg-secondary hover:bg-secondary-dark text-white font-semibold py-4 rounded-sm shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Buy Gift Card ₹{selectedAmount || customAmount || 0}
              </button>

              <p className="text-xs text-gray-500 text-center mt-4">
                By purchasing, you agree to our{" "}
                <Link href="/terms" className="text-primary hover:underline">
                  Terms & Conditions
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16 bg-white rounded-lg shadow-card p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Frequently Asked Questions</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">How do I redeem my gift card?</h3>
              <p className="text-gray-600">
                Simply enter the gift card code during checkout, and the amount will be deducted from your order total.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Do gift cards expire?</h3>
              <p className="text-gray-600">
                No, BolBazar gift cards never expire. Use them whenever you want!
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Can I use multiple gift cards?</h3>
              <p className="text-gray-600">
                Yes, you can use multiple gift cards on a single order.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GiftCards;
