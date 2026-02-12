"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const AdminResetPassword = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Note: This is a placeholder for admin password reset
      // In production, you would send a reset link to the admin email
      toast.success("Password reset instructions sent to your email");
      
      // For now, redirect back to login after 2 seconds
      setTimeout(() => {
        router.push("/admin/login");
      }, 2000);
      
    } catch (error) {
      console.error('Password reset error:', error);
      toast.error("Failed to send reset instructions");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-700">
      <div className="w-full max-w-md mx-4 bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 p-8 text-center">
          <div className="text-6xl mb-4">🔑</div>
          <h2 className="text-3xl font-bold text-white mb-2">Reset Password</h2>
          <p className="text-gray-300">Admin Account Recovery</p>
        </div>

        <div className="p-8">
          <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-start">
              <span className="text-2xl mr-3">📧</span>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Password Recovery</h3>
                <p className="text-sm text-gray-600">
                  Enter your admin email to receive password reset instructions
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
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02]"
            >
              {loading ? 'Sending...' : '📧 Send Reset Link'}
            </button>
          </form>

          <div className="mt-6 text-center space-y-4">
            <div className="flex items-center justify-center space-x-2">
              <span className="text-gray-500 text-sm">Remember your password?</span>
              <a href="/admin/login" className="text-blue-600 hover:text-blue-800 hover:underline text-sm font-medium">
                Login here
              </a>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <a href="/login" className="text-gray-500 hover:text-gray-700 text-sm">
                ← Back to User Login
              </a>
            </div>
          </div>

          <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <div className="flex items-start">
              <span className="text-xl mr-2">⚠️</span>
              <div>
                <p className="text-xs text-gray-600">
                  <strong>Note:</strong> If you're the master admin and forgot your password, please contact the system administrator or refer to the ADMIN_SECURITY_GUIDE.md for instructions on generating a new password hash.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminResetPassword;
