"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { generateKeyPair, exportPublicKey, storePrivateKey, getDeviceInfo } from "@/utils/crypto";

const SellerSignup = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fname: "",
    lname: "",
    email: "",
    phone: "",
    businessName: ""
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Generate key pair
      const keyPair = await generateKeyPair();
      const publicKey = await exportPublicKey(keyPair.publicKey);
      await storePrivateKey(keyPair.privateKey, formData.email);
      const deviceInfo = getDeviceInfo();

      // Send to seller endpoint
      const res = await fetch("http://localhost:5000/seller/add-passwordless", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          publicKey,
          deviceInfo
        }),
      });

      if (res.status === 200) {
        toast.success("🎉 Seller Account Created!");
        setFormData({ fname: "", lname: "", email: "", phone: "", businessName: "" });
        setTimeout(() => router.push("/sellerLogin"), 1500);
      } else {
        const error = await res.json();
        toast.error(error.message || "Something went wrong");
      }
    } catch (error) {
      console.error('Seller signup error:', error);
      toast.error(error.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-red-50 py-8">
      <div className="w-full max-w-5xl mx-4 bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="grid md:grid-cols-2">
          {/* Left Side */}
          <div className="hidden md:flex items-center justify-center bg-gradient-to-br from-orange-500 to-red-500 p-8">
            <div className="text-center">
              <div className="text-6xl mb-4">🛍️</div>
              <h2 className="text-3xl font-bold text-white mb-4">Start Selling!</h2>
              <p className="text-orange-100 text-lg mb-6">
                Join thousands of sellers on BolBazar
              </p>
              <div className="space-y-3 text-left bg-white/10 p-6 rounded-lg backdrop-blur-sm">
                <div className="flex items-center text-white">
                  <span className="text-2xl mr-3">✓</span>
                  <span>Easy product management</span>
                </div>
                <div className="flex items-center text-white">
                  <span className="text-2xl mr-3">✓</span>
                  <span>Track orders in real-time</span>
                </div>
                <div className="flex items-center text-white">
                  <span className="text-2xl mr-3">✓</span>
                  <span>Secure passwordless login</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="p-8 md:p-12">
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Seller Registration</h2>
              <p className="text-gray-600">Create your seller account</p>
            </div>

            <div className="mb-6 p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-start">
                <span className="text-2xl mr-3">🔒</span>
                <div>
                  <h3 className="font-semibold text-green-900 mb-1">Passwordless Registration</h3>
                  <p className="text-sm text-green-700">
                    No password needed - secure cryptographic authentication
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="fname" className="block text-sm font-semibold text-gray-700 mb-2">
                    First Name
                  </label>
                  <input
                    id="fname"
                    name="fname"
                    type="text"
                    value={formData.fname}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all text-gray-900 bg-white"
                  />
                </div>
                <div>
                  <label htmlFor="lname" className="block text-sm font-semibold text-gray-700 mb-2">
                    Last Name
                  </label>
                  <input
                    id="lname"
                    name="lname"
                    type="text"
                    value={formData.lname}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all text-gray-900 bg-white"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="businessName" className="block text-sm font-semibold text-gray-700 mb-2">
                  Business Name
                </label>
                <input
                  id="businessName"
                  name="businessName"
                  type="text"
                  value={formData.businessName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all text-gray-900 bg-white"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all text-gray-900 bg-white"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all text-gray-900 bg-white"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02]"
              >
                {loading ? 'Creating Account...' : '🚀 Register as Seller'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Already a seller?{' '}
                <a href="/sellerLogin" className="text-orange-600 hover:text-orange-700 font-semibold">
                  Login here
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerSignup;
