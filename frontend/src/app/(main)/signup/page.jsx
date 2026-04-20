"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { passwordlessSignup } from "@/utils/passwordlessAuth";
import useVoiceContext from "@/context/VoiceContext";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const Signup = () => {
  const router = useRouter();
  const { finalTranscript, voiceResponse, resetTranscript } = useVoiceContext();
  const [formData, setFormData] = useState({
    fname: "",
    lname: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [loading, setLoading] = useState(false);
  const [usePassword, setUsePassword] = useState(true); // Default to password signup

  // Voice commands for signup
  useEffect(() => {
    if (!finalTranscript) return;
    const lower = finalTranscript.toLowerCase();

    // First name command
    if (lower.includes('first name:') || lower.includes('fname:') || lower.includes('उड:स् नाम:')) {
      const fname = finalTranscript.replace(/first name:/i, '').replace(/fname:/i, '').replace(/उड:स् /i, '').trim();
      if (fname) {
        setFormData(prev => ({ ...prev, fname }));
        voiceResponse('First name set to ' + fname);
        resetTranscript();
        return;
      }
    }

    // Last name command
    if (lower.includes('last name:') || lower.includes('lname:') || lower.includes('अंतिम सवर्ण:')) {
      const lname = finalTranscript.replace(/last name:/i, '').replace(/lname:/i, '').replace(/अंतिम सवर्ण:/i, '').trim();
      if (lname) {
        setFormData(prev => ({ ...prev, lname }));
        voiceResponse('Last name set to ' + lname);
        resetTranscript();
        return;
      }
    }

    // Email command
    if (lower.includes('email:') || lower.includes('ईमेल:')) {
      const email = finalTranscript.replace(/email:/i, '').replace(/ईमेल:/i, '').trim();
      if (email) {
        setFormData(prev => ({ ...prev, email }));
        voiceResponse('Email set');
        resetTranscript();
        return;
      }
    }

    // Password command
    if (lower.includes('password:') || lower.includes('पासवर्ड:')) {
      const password = finalTranscript.replace(/password:/i, '').replace(/पासवर्ड:/i, '').trim();
      if (password && password.length >= 6) {
        setFormData(prev => ({ ...prev, password, confirmPassword: password }));
        voiceResponse('Password set');
        resetTranscript();
        return;
      }
    }

    // Signup command
    if (lower.includes('signup') || lower.includes('register') || lower.includes('साइन अप')) {
      voiceResponse('Creating your account');
      setTimeout(() => {
        document.querySelector('button[type="submit"]')?.click();
      }, 500);
      resetTranscript();
      return;
    }
  }, [finalTranscript, voiceResponse, resetTranscript]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Password-based signup
  const handlePasswordSignup = async () => {
    if (formData.password !== formData.confirmPassword) {
      throw new Error("Passwords do not match");
    }
    if (formData.password.length < 6) {
      throw new Error("Password must be at least 6 characters");
    }

    const response = await fetch(`${API_URL}/user/add`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fname: formData.fname,
        lname: formData.lname,
        email: formData.email,
        password: formData.password
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Signup failed");
    }

    return await response.json();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (usePassword) {
        await handlePasswordSignup();
        toast.success("Account created successfully!");
      } else {
        await passwordlessSignup(formData.fname, formData.lname, formData.email);
        toast.success("🎉 Account Created - No Password Needed!");
      }
      setFormData({ fname: "", lname: "", email: "", password: "", confirmPassword: "" });
      setTimeout(() => router.push("/login"), 1500);
    } catch (error) {
      console.error('Signup error:', error);
      toast.error(error.message || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-primary/5">
      <div className="w-full max-w-5xl mx-4 bg-white rounded-sm shadow-2xl overflow-hidden">
        <div className="grid md:grid-cols-2">
          {/* Left Side - Image */}
          <div className="hidden md:flex items-center justify-center bg-gradient-to-br from-primary to-primary/80 p-8">
            <div className="text-center">
              <div className="text-6xl mb-4">🚀</div>
              <h2 className="text-3xl font-bold text-white mb-4">Join BolBazar!</h2>
              <p className="text-emerald-100 text-lg mb-6">
                Create your account in seconds without remembering any passwords
              </p>
                <div className="space-y-3 text-left bg-white/10 p-6 rounded-sm backdrop-blur-sm">
                <div className="flex items-center text-white">
                  <span className="text-2xl mr-3">✓</span>
                  <span>No password to remember</span>
                </div>
                <div className="flex items-center text-white">
                  <span className="text-2xl mr-3">✓</span>
                  <span>Secure cryptographic keys</span>
                </div>
                <div className="flex items-center text-white">
                  <span className="text-2xl mr-3">✓</span>
                  <span>Multi-device support</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="p-8 md:p-12">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Create Account</h2>
              <p className="text-gray-600">Join us with just your basic details</p>
            </div>

            {/* Info Box */}
            <div className="mb-6 p-4 bg-green-50 rounded-sm border border-green-200">
              <div className="flex items-start">
                <span className="text-2xl mr-3">{usePassword ? "🔐" : "🔒"}</span>
                <div>
                  <h3 className="font-semibold text-green-900 mb-1">
                    {usePassword ? "Password Signup" : "Passwordless Signup"}
                  </h3>
                  <p className="text-sm text-green-700">
                    {usePassword 
                      ? "Create an account with a secure password."
                      : "We'll generate secure keys on your device. No password needed!"
                    }
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name Fields */}
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
                    autoComplete="given-name"
                    placeholder="John"
                    className="w-full px-4 py-3 rounded-sm border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-gray-900 bg-white"
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
                    autoComplete="family-name"
                    placeholder="Doe"
                    className="w-full px-4 py-3 rounded-sm border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-gray-900 bg-white"
                  />
                </div>
              </div>

              {/* Email Field */}
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
                  autoComplete="email"
                  placeholder="your.email@example.com"
                  className="w-full px-4 py-3 rounded-sm border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-gray-900 bg-white"
                />
              </div>

              {/* Password Fields - shown when usePassword is true */}
              {usePassword && (
                <>
                  <div>
                    <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                      Password
                    </label>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      autoComplete="new-password"
                      placeholder="Create a password (min 6 characters)"
                      className="w-full px-4 py-3 rounded-sm border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-gray-900 bg-white"
                    />
                  </div>
                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                      Confirm Password
                    </label>
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                      autoComplete="new-password"
                      placeholder="Confirm your password"
                      className="w-full px-4 py-3 rounded-sm border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-gray-900 bg-white"
                    />
                  </div>
                </>
              )}

              {/* Toggle Signup Method */}
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setUsePassword(!usePassword)}
                  className="text-sm text-primary hover:underline"
                >
                  {usePassword ? "Try passwordless signup instead" : "Use password instead"}
                </button>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-secondary hover:bg-secondary/90 text-white font-semibold py-3 px-6 rounded-sm shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02]"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating Account...
                  </span>
                ) : (
                  '🎉 Create Account'
                )}
              </button>
            </form>

            {/* Footer Links */}
            <div className="mt-8 text-center space-y-3">
              <p className="text-gray-600">
                Already have an account?{' '}
                <a href="/login" className="text-primary hover:text-primary/80 font-semibold">
                  Login here
                </a>
              </p>
              <div className="flex justify-center space-x-4 text-sm">
                <a href="/seller/sellersignup" className="text-gray-500 hover:text-primary">
                  Seller Signup
                </a>
                <span className="text-gray-300">|</span>
                <a href="/admin/adminsignup" className="text-gray-500 hover:text-primary">
                  Admin Signup
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
