"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import useSellerContext from "@/context/SellerContext";
import useVoiceContext from "@/context/VoiceContext";
import { getPrivateKey, signChallenge } from "@/utils/crypto";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const SellerLogin = () => {
  const router = useRouter();
  const { setCurrentSeller, setSellerLoggedIn } = useSellerContext();
  const { finalTranscript, voiceResponse, resetTranscript } = useVoiceContext();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [usePassword, setUsePassword] = useState(true); // Toggle between password and passwordless

  // Password-based login
  const handlePasswordLogin = async () => {
    try {
      const response = await fetch(`${API_URL}/seller/authenticate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        throw new Error('Invalid email or password');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      throw error;
    }
  };

  // Passwordless login
  const handlePasswordlessLogin = async () => {
    try {
      // Get private key from storage
      const privateKey = await getPrivateKey(email);
      if (!privateKey) {
        throw new Error("No passwordless credentials found. Please use password login or signup again.");
      }

      // Request challenge
      const challengeRes = await fetch(`${API_URL}/seller/passwordless/challenge`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      if (!challengeRes.ok) {
        throw new Error('Failed to get authentication challenge');
      }

      const { challenge } = await challengeRes.json();

      // Sign challenge
      const signature = await signChallenge(challenge, privateKey);

      // Verify signature
      const verifyRes = await fetch(`${API_URL}/seller/passwordless/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, signature })
      });

      if (!verifyRes.ok) {
        throw new Error('Authentication failed');
      }

      const data = await verifyRes.json();
      return data;
    } catch (error) {
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log(`🔐 Starting seller ${usePassword ? 'password' : 'passwordless'} login for:`, email);
      
      let data;
      if (usePassword) {
        data = await handlePasswordLogin();
        toast.success("🎉 Seller Login Successful!");
      } else {
        data = await handlePasswordlessLogin();
        toast.success("✨ Passwordless Login Successful!");
      }
      
      // Always include token in seller object for context and sessionStorage
      const token = data.token || (data.seller && data.seller.token);
      const sellerData = {
        _id: data._id || data.seller?._id,
        fname: data.fname || data.seller?.fname,
        lname: data.lname || data.seller?.lname,
        email: email,
        avatar: data.avatar || data.seller?.avatar,
        token: token
      };
      sessionStorage.setItem('seller', JSON.stringify(sellerData));

      // Update SellerContext
      setCurrentSeller(sellerData);
      setSellerLoggedIn(true);

      // Redirect to dashboard
      console.log("🚀 Redirecting seller to dashboard...");
      console.log("Seller data:", sellerData);
      console.log("Redirect target: /seller/sellerdashboard");
      router.push("/seller/sellerdashboard");
    } catch (error) {
      console.error('Seller login error:', error);
      toast.error(error.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  // Voice commands for seller login
  useEffect(() => {
    if (!finalTranscript) return;
    const lower = finalTranscript.toLowerCase();

    if (lower.includes('email:')) {
      const emailVal = finalTranscript.replace(/email:/i, '').trim();
      if (emailVal) {
        setEmail(emailVal);
        voiceResponse('Email set');
        resetTranscript();
        return;
      }
    }

    if (lower.includes('password:')) {
      const passVal = finalTranscript.replace(/password:/i, '').trim();
      if (passVal && passVal.length >= 6) {
        setPassword(passVal);
        voiceResponse('Password set');
        resetTranscript();
        return;
      }
    }

    if (lower.includes('login') || lower.includes('seller login')) {
      voiceResponse('Logging you in as seller');
      setTimeout(() => {
        document.querySelector('button[type="submit"]')?.click();
      }, 500);
      resetTranscript();
      return;
    }
  }, [finalTranscript, voiceResponse, resetTranscript]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-green-50">
      <div className="w-full max-w-4xl mx-4 bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="grid md:grid-cols-2">
          {/* Left Side */}
          <div className="hidden md:flex items-center justify-center bg-gradient-to-br from-emerald-500 to-emerald-600 p-8">
            <div className="text-center">
              <div className="text-6xl mb-4">🏪</div>
              <h2 className="text-3xl font-bold text-white mb-4">Seller Portal</h2>
              <p className="text-emerald-100 text-lg">
                Manage your products and orders securely
              </p>
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="p-8 md:p-12">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Seller Login</h2>
              <p className="text-gray-600">Access your seller dashboard</p>
            </div>

            <div className="mb-6 p-4 bg-emerald-50 rounded-lg border border-emerald-200">
              <div className="flex items-start">
                <span className="text-2xl mr-3">{usePassword ? "🔐" : "✨"}</span>
                <div>
                  <h3 className="font-semibold text-emerald-900 mb-1">
                    {usePassword ? "Password Login" : "Passwordless Login"}
                  </h3>
                  <p className="text-sm text-emerald-700">
                    {usePassword 
                      ? "Secure seller authentication with email and password"
                      : "No password needed! We use secure cryptographic keys stored on your device."
                    }
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="seller@example.com"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-gray-900 bg-white"
                />
              </div>

              {/* Password Field - only shown when usePassword is true */}
              {usePassword && (
                <div>
                  <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      placeholder="Enter your password"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-gray-900 bg-white"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? '👁️' : '👁️‍🗨️'}
                    </button>
                  </div>
                  <div className="mt-2 text-right">
                    <a href="/seller/reset-password" className="text-sm text-emerald-600 hover:text-emerald-700 hover:underline font-medium">
                      Forgot Password?
                    </a>
                  </div>
                </div>
              )}

              {/* Toggle Login Method */}
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setUsePassword(!usePassword)}
                  className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
                >
                  {usePassword ? "🔓 Use Passwordless Login" : "🔐 Use Password Login"}
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02]"
              >
                {loading ? 'Signing in...' : usePassword ? '🔐 Login with Password' : '✨ Login without Password'}
              </button>
            </form>

            <div className="mt-8 text-center space-y-3">
              <p className="text-gray-600">
                Not a seller yet?{' '}
                <a href="/seller/sellersignup" className="text-emerald-600 hover:text-emerald-700 font-semibold">
                  Register here
                </a>
              </p>
              <div className="flex justify-center space-x-4 text-sm">
                <a href="/login" className="text-gray-500 hover:text-emerald-600">
                  User Login
                </a>
                <span className="text-gray-300">|</span>
                <a href="/admin/login" className="text-gray-500 hover:text-emerald-600">
                  Admin Login
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerLogin;
