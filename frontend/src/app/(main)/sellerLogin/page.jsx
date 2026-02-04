"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { passwordlessLogin } from "@/utils/passwordlessAuth";
import useAppContext from "@/context/AppContext";

const SellerLogin = () => {
  const router = useRouter();
  const { setLoggedIn } = useAppContext();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log('🔐 Starting seller login for:', email);
      
      // Request challenge from seller endpoint
      const challengeRes = await fetch(`http://localhost:5000/seller/request-challenge`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      if (!challengeRes.ok) {
        throw new Error('Seller not found. Please signup first on this device.');
      }

      const { challenge } = await challengeRes.json();
      console.log('✅ Received challenge:', challenge);
      
      // Get private key and sign
      const { getPrivateKey, signChallenge, getDeviceInfo } = await import('@/utils/crypto');
      const privateKey = await getPrivateKey(email);
      if (!privateKey) {
        throw new Error('No private key found. Please signup first on this device.');
      }
      console.log('✅ Retrieved private key');

      const signature = await signChallenge(challenge, privateKey);
      console.log('✅ Generated signature (first 50 chars):', signature.substring(0, 50));
      
      const deviceInfo = getDeviceInfo();

      // Verify with seller endpoint
      const verifyRes = await fetch(`http://localhost:5000/seller/verify-challenge`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, signature, deviceInfo })
      });

      if (!verifyRes.ok) {
        const error = await verifyRes.json();
        throw new Error(error.message || 'Login failed');
      }

      const data = await verifyRes.json();
      console.log('✅ Login successful!');
      toast.success("🎉 Seller Login Successful!");
      sessionStorage.setItem('seller', JSON.stringify(data));
      setLoggedIn(true);
      router.push("/seller/sellerdashboard");
    } catch (error) {
      console.error('Seller login error:', error);
      toast.error(error.message || "Login failed. Please signup first.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-red-50">
      <div className="w-full max-w-4xl mx-4 bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="grid md:grid-cols-2">
          {/* Left Side */}
          <div className="hidden md:flex items-center justify-center bg-gradient-to-br from-orange-500 to-red-500 p-8">
            <div className="text-center">
              <div className="text-6xl mb-4">🏪</div>
              <h2 className="text-3xl font-bold text-white mb-4">Seller Portal</h2>
              <p className="text-orange-100 text-lg">
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

            <div className="mb-6 p-4 bg-orange-50 rounded-lg border border-orange-200">
              <div className="flex items-start">
                <span className="text-2xl mr-3">🔐</span>
                <div>
                  <h3 className="font-semibold text-orange-900 mb-1">Passwordless Login</h3>
                  <p className="text-sm text-orange-700">
                    Secure seller authentication without passwords
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
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all text-gray-900 bg-white"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02]"
              >
                {loading ? 'Signing in...' : '🏪 Login as Seller'}
              </button>
            </form>

            <div className="mt-8 text-center space-y-3">
              <p className="text-gray-600">
                Not a seller yet?{' '}
                <a href="/seller/sellersignup" className="text-orange-600 hover:text-orange-700 font-semibold">
                  Register here
                </a>
              </p>
              <div className="flex justify-center space-x-4 text-sm">
                <a href="/login" className="text-gray-500 hover:text-orange-600">
                  User Login
                </a>
                <span className="text-gray-300">|</span>
                <a href="/admin/login" className="text-gray-500 hover:text-orange-600">
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
