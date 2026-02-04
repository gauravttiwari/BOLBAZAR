"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const AdminLogin = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Using admin-specific passwordless login
      const challengeRes = await fetch(`http://localhost:5000/api/passwordless-auth/request-challenge`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      if (!challengeRes.ok) {
        throw new Error('Admin not found. Please contact system administrator.');
      }

      const { challenge } = await challengeRes.json();
      
      // Get private key and sign
      const { getPrivateKey, signChallenge } = await import('@/utils/crypto');
      const privateKey = await getPrivateKey(email);
      if (!privateKey) {
        throw new Error('No private key found. Please signup first on this device.');
      }

      const signature = await signChallenge(challenge, privateKey);

      // Verify with admin endpoint
      const verifyRes = await fetch(`http://localhost:5000/admin/authenticate-passwordless`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, signature, challenge })
      });

      if (!verifyRes.ok) {
        const error = await verifyRes.json();
        throw new Error(error.message || 'Login failed');
      }

      const data = await verifyRes.json();
      toast.success("🎉 Admin Login Successful!");
      sessionStorage.setItem('admin', JSON.stringify(data));
      router.push("/admin/admindashboard");
    } catch (error) {
      console.error('Admin login error:', error);
      toast.error(error.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-700">
      <div className="w-full max-w-md mx-4 bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 p-8 text-center">
          <div className="text-6xl mb-4">👑</div>
          <h2 className="text-3xl font-bold text-white mb-2">Admin Portal</h2>
          <p className="text-gray-300">Secure administrative access</p>
        </div>

        <div className="p-8">
          <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-start">
              <span className="text-2xl mr-3">🔐</span>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Passwordless Admin Login</h3>
                <p className="text-sm text-gray-600">
                  Secure authentication for administrators
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                Admin Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="admin@bolbazar.com"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all text-gray-900 bg-white"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-900 hover:to-black text-white font-semibold py-3 px-6 rounded-lg shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02]"
            >
              {loading ? 'Authenticating...' : '👑 Admin Login'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600 text-sm">
              Need access?{' '}
              <a href="/admin/adminsignup" className="text-gray-800 hover:text-gray-900 font-semibold">
                Request Admin Account
              </a>
            </p>
            <div className="mt-4">
              <a href="/login" className="text-gray-500 hover:text-gray-700 text-sm">
                ← Back to User Login
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
