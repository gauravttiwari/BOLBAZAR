"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const SellerResetPassword = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Note: This is a placeholder for seller password reset
      // In production, you would send a reset link to the seller email
      toast.success("Password reset instructions sent to your email");
      
      // For now, redirect back to login after 2 seconds
      setTimeout(() => {
        router.push("/sellerLogin");
      }, 2000);
      
    } catch (error) {
      console.error('Password reset error:', error);
      toast.error("Failed to send reset instructions");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-green-50">
      <div className="w-full max-w-md mx-4 bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 p-8 text-center">
          <div className="text-6xl mb-4">🔑</div>
          <h2 className="text-3xl font-bold text-white mb-2">Reset Password</h2>
          <p className="text-emerald-100">Seller Account Recovery</p>
        </div>

        <div className="p-8">
          <div className="mb-6 p-4 bg-emerald-50 rounded-lg border border-emerald-200">
            <div className="flex items-start">
              <span className="text-2xl mr-3">📧</span>
              <div>
                <h3 className="font-semibold text-emerald-900 mb-1">Password Recovery</h3>
                <p className="text-sm text-emerald-700">
                  Enter your seller email to receive password reset instructions
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                Seller Email
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

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02]"
            >
              {loading ? 'Sending...' : '📧 Send Reset Link'}
            </button>
          </form>

          <div className="mt-6 text-center space-y-4">
            <div className="flex items-center justify-center space-x-2">
              <span className="text-gray-500 text-sm">Remember your password?</span>
              <a href="/sellerLogin" className="text-emerald-600 hover:text-emerald-700 hover:underline text-sm font-medium">
                Login here
              </a>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <a href="/login" className="text-gray-500 hover:text-emerald-600 text-sm">
                ← Back to User Login
              </a>
            </div>
          </div>

          <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <div className="flex items-start">
              <span className="text-xl mr-2">⚠️</span>
              <div>
                <p className="text-xs text-gray-600">
                  <strong>Note:</strong> If you don't receive the email within a few minutes, please check your spam folder or contact support for assistance.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerResetPassword;
