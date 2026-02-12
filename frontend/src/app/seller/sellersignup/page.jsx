"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { generateKeyPair, exportPublicKey, storePrivateKey, getDeviceInfo } from "@/utils/crypto";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const SellerSignup = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fname: "",
    lname: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    businessName: ""
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [usePassword, setUsePassword] = useState(true); // Toggle between password and passwordless

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Password-based signup
  const handlePasswordSignup = async () => {
    // Validate password match
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match!");
      return false;
    }

    // Validate password strength
    if (formData.password.length < 8) {
      toast.error("Password must be at least 8 characters long!");
      return false;
    }

    try {
      const res = await fetch(`${API_URL}/seller/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fname: formData.fname,
          lname: formData.lname,
          email: formData.email,
          password: formData.password,
          phone: formData.phone,
          businessName: formData.businessName
        }),
      });

      if (res.status === 200) {
        return true;
      } else {
        const error = await res.json();
        toast.error(error.message || "Something went wrong");
        return false;
      }
    } catch (error) {
      throw error;
    }
  };

  // Passwordless signup
  const handlePasswordlessSignup = async () => {
    try {
      // Generate key pair
      const keyPair = await generateKeyPair();
      
      // Export public key
      const publicKey = await exportPublicKey(keyPair.publicKey);
      
      // Store private key locally
      await storePrivateKey(keyPair.privateKey, formData.email);
      
      // Get device info
      const deviceInfo = getDeviceInfo();
      
      // Send signup request
      const res = await fetch(`${API_URL}/seller/passwordless/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fname: formData.fname,
          lname: formData.lname,
          email: formData.email,
          phone: formData.phone,
          businessName: formData.businessName,
          publicKey,
          deviceInfo
        }),
      });

      if (res.status === 200) {
        return true;
      } else {
        const error = await res.json();
        toast.error(error.message || "Something went wrong");
        return false;
      }
    } catch (error) {
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let success = false;
      if (usePassword) {
        success = await handlePasswordSignup();
        if (success) {
          toast.success("🎉 Seller Account Created!");
        }
      } else {
        success = await handlePasswordlessSignup();
        if (success) {
          toast.success("✨ Passwordless Account Created!");
        }
      }
      
      if (success) {
        setFormData({ fname: "", lname: "", email: "", password: "", confirmPassword: "", phone: "", businessName: "" });
        setTimeout(() => router.push("/sellerLogin"), 1500);
      }
    } catch (error) {
      console.error('Seller signup error:', error);
      toast.error(error.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-green-50 py-8">
      <div className="w-full max-w-5xl mx-4 bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="grid md:grid-cols-2">
          {/* Left Side */}
          <div className="hidden md:flex items-center justify-center bg-gradient-to-br from-emerald-500 to-emerald-600 p-8">
            <div className="text-center">
              <div className="text-6xl mb-4">🛍️</div>
              <h2 className="text-3xl font-bold text-white mb-4">Start Selling!</h2>
              <p className="text-emerald-100 text-lg mb-6">
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
                  <span>Password or Passwordless options</span>
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

            <div className="mb-6 p-4 bg-emerald-50 rounded-lg border border-emerald-200">
              <div className="flex items-start">
                <span className="text-2xl mr-3">{usePassword ? "🔒" : "✨"}</span>
                <div>
                  <h3 className="font-semibold text-emerald-900 mb-1">
                    {usePassword ? "Password Registration" : "Passwordless Registration"}
                  </h3>
                  <p className="text-sm text-emerald-700">
                    {usePassword 
                      ? "Create your account with email and password"
                      : "No password needed! Your device stores secure cryptographic keys."
                    }
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
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-gray-900 bg-white"
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
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-gray-900 bg-white"
                />
              </div>

              {/* Password fields - only shown when usePassword is true */}
              {usePassword && (
                <>
                  <div>
                    <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={handleChange}
                        required
                        placeholder="Min. 8 characters"
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-gray-900 bg-white"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showPassword ? '👁️' : '👁️‍🗨️'}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                        placeholder="Re-enter password"
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-gray-900 bg-white"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                      </button>
                    </div>
                  </div>
                </>
              )}

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
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-gray-900 bg-white"
                />
              </div>

              {/* Toggle Signup Method */}
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setUsePassword(!usePassword)}
                  className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
                >
                  {usePassword ? "🔓 Use Passwordless Signup" : "🔐 Use Password Signup"}
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02]"
              >
                {loading ? 'Creating Account...' : usePassword ? '🔐 Register with Password' : '✨ Register without Password'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Already a seller?{' '}
                <a href="/sellerLogin" className="text-emerald-600 hover:text-emerald-700 font-semibold">
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
