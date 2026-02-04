"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { generateKeyPair, exportPublicKey, storePrivateKey, getDeviceInfo } from "@/utils/crypto";

const AdminSignup = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fname: "",
    lname: "",
    email: "",
    adminKey: ""
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

      // Send to admin endpoint
      const res = await fetch("http://localhost:5000/admin/add-passwordless", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          publicKey,
          deviceInfo
        }),
      });

      if (res.status === 200) {
        toast.success("🎉 Admin Account Created!");
        setFormData({ fname: "", lname: "", email: "", adminKey: "" });
        setTimeout(() => router.push("/admin/login"), 1500);
      } else {
        const error = await res.json();
        toast.error(error.message || "Invalid admin key or signup failed");
      }
    } catch (error) {
      console.error('Admin signup error:', error);
      toast.error(error.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-700 py-8">
      <div className="w-full max-w-md mx-4 bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 p-8 text-center">
          <div className="text-6xl mb-4">👑</div>
          <h2 className="text-3xl font-bold text-white mb-2">Admin Registration</h2>
          <p className="text-gray-300">Create admin account</p>
        </div>

        <div className="p-8">
          <div className="mb-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <div className="flex items-start">
              <span className="text-2xl mr-3">⚠️</span>
              <div>
                <h3 className="font-semibold text-yellow-900 mb-1">Restricted Access</h3>
                <p className="text-sm text-yellow-700">
                  Admin registration requires a valid admin key
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
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all text-gray-900 bg-white"
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
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all text-gray-900 bg-white"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                Admin Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="admin@bolbazar.com"
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all text-gray-900 bg-white"
              />
            </div>

            <div>
              <label htmlFor="adminKey" className="block text-sm font-semibold text-gray-700 mb-2">
                Admin Key
              </label>
              <input
                id="adminKey"
                name="adminKey"
                type="password"
                value={formData.adminKey}
                onChange={handleChange}
                required
                placeholder="Enter admin registration key"
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all text-gray-900 bg-white"
              />
              <p className="text-xs text-gray-500 mt-1">Contact system administrator for admin key</p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-900 hover:to-black text-white font-semibold py-3 px-6 rounded-lg shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02]"
            >
              {loading ? 'Creating Account...' : '👑 Register as Admin'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600 text-sm">
              Already have admin access?{' '}
              <a href="/admin/login" className="text-gray-800 hover:text-gray-900 font-semibold">
                Login here
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSignup;
