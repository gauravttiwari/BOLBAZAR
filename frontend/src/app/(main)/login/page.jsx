"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { passwordlessLogin } from "@/utils/passwordlessAuth";
import useAppContext from "@/context/AppContext";
import useVoiceContext from "@/context/VoiceContext";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const Login = () => {
  const router = useRouter();
  const { setLoggedIn, setCurrentUser } = useAppContext();
  const { finalTranscript, voiceResponse, resetTranscript } = useVoiceContext();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [usePassword, setUsePassword] = useState(true); // Default to password login

  // Voice commands for login
  useEffect(() => {
    if (!finalTranscript) return;
    const lower = finalTranscript.toLowerCase();

    // Email voice command
    if (lower.includes('email:') || lower.includes('ईमेल:')) {
      const emailValue = finalTranscript.replace(/email:/i, '').replace(/ईमेल:/i, '').trim();
      if (emailValue) {
        setEmail(emailValue);
        voiceResponse('Email set to ' + emailValue);
        resetTranscript();
        return;
      }
    }

    // Password voice command
    if (lower.includes('password:') || lower.includes('पासवर्ड:')) {
      const passValue = finalTranscript.replace(/password:/i, '').replace(/पासवर्ड:/i, '').trim();
      if (passValue && passValue.length >= 6) {
        setPassword(passValue);
        voiceResponse('Password set');
        resetTranscript();
        return;
      }
    }

    // Login command
    if (lower.includes('login') || lower.includes('लॉगिन करो') || lower.includes('साइन इन')) {
      voiceResponse('Logging you in');
      setTimeout(() => {
        document.querySelector('button[type="submit"]')?.click();
      }, 500);
      resetTranscript();
      return;
    }

    // Toggle login method
    if (lower.includes('passwordless') || lower.includes('बिना पासवर्ड')) {
      setUsePassword(false);
      voiceResponse('Switched to passwordless login');
      resetTranscript();
      return;
    }
  }, [finalTranscript, voiceResponse, resetTranscript]);

  // Traditional password login
  const handlePasswordLogin = async () => {
    try {
      const response = await fetch(`${API_URL}/user/authenticate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Invalid email or password");
      }

      const data = await response.json();
      toast.success("Login Successful!");
      
      const userData = { 
        _id: data._id, 
        fname: data.fname, 
        lname: data.lname, 
        email: data.email, 
        token: data.token 
      };
      
      // Update context and sessionStorage (context will handle sessionStorage)
      setLoggedIn(true);
      setCurrentUser(userData);
      
      // Check if user came from checkout
      const redirectPath = sessionStorage.getItem('redirectAfterLogin');
      if (redirectPath) {
        sessionStorage.removeItem('redirectAfterLogin');
        // Small delay to ensure state is updated
        setTimeout(() => router.push(redirectPath), 200);
      } else {
        router.push("/");
      }
    } catch (error) {
      throw error;
    }
  };

  // Passwordless login
  const handlePasswordlessLogin = async () => {
    try {
      const data = await passwordlessLogin(email);
      toast.success("🎉 Login Successful - No Password Needed!");
      
      // Update context (context will handle sessionStorage)
      setLoggedIn(true);
      setCurrentUser(data.user);
      
      // Check if user came from checkout
      const redirectPath = sessionStorage.getItem('redirectAfterLogin');
      if (redirectPath) {
        sessionStorage.removeItem('redirectAfterLogin');
        // Small delay to ensure state is updated
        setTimeout(() => router.push(redirectPath), 200);
      } else {
        router.push("/");
      }
    } catch (error) {
      // If passwordless fails, show password option
      console.error('Passwordless login error:', error);
      setUsePassword(true);
      throw new Error("Passwordless login not available. Please use your password.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (usePassword) {
        await handlePasswordLogin();
      } else {
        await handlePasswordlessLogin();
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface py-12">
      <div className="w-full max-w-4xl mx-4 bg-white rounded-sm shadow-card overflow-hidden">
        <div className="grid md:grid-cols-2">
          {/* Left Side - Image */}
          <div className="hidden md:flex items-center justify-center bg-primary p-8">
            <div className="text-center">
              <div className="text-6xl mb-4">🛒</div>
              <h2 className="text-3xl font-bold text-white mb-4">Welcome to BolBazar!</h2>
              <p className="text-emerald-100 text-lg">
                Login securely without passwords using modern cryptography
              </p>
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="p-8 md:p-12">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Login to BolBazar</h2>
              <p className="text-gray-500">Enter your email to continue</p>
            </div>

            {/* Info Box */}
            <div className="mb-6 p-4 bg-primary/5 rounded-sm border border-primary/20">
              <div className="flex items-start">
                <span className="text-2xl mr-3">{usePassword ? "🔐" : "✨"}</span>
                <div>
                  <h3 className="font-semibold text-primary mb-1">
                    {usePassword ? "Password Login" : "Passwordless Login"}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {usePassword 
                      ? "Enter your email and password to continue."
                      : "No password needed! We use secure cryptographic keys stored on your device."
                    }
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  placeholder="your.email@example.com"
                  className="w-full px-4 py-3 rounded-sm border border-gray-300 focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all text-gray-900 bg-white"
                />
              </div>

              {/* Password Field - shown when usePassword is true */}
              {usePassword && (
                <div>
                  <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                    Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    className="w-full px-4 py-3 rounded-sm border border-gray-300 focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all text-gray-900 bg-white"
                  />
                  <div className="mt-2 text-right">
                    <a href="/reset-password" className="text-sm text-primary hover:underline">
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
                  className="text-sm text-primary hover:underline"
                >
                  {usePassword ? "Try passwordless login instead" : "Use password instead"}
                </button>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-secondary hover:bg-secondary-dark text-white font-semibold py-3 px-6 rounded-sm shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing in...
                  </span>
                ) : (
                  usePassword ? '🔐 Login with Password' : '🔓 Login Securely'
                )}
              </button>
            </form>

            {/* Footer Links */}
            <div className="mt-8 text-center space-y-3">
              <p className="text-gray-600">
                Don't have an account?{' '}
                <a href="/signup" className="text-primary hover:underline font-semibold">
                  Sign up here
                </a>
              </p>
              <div className="flex justify-center space-x-4 text-sm">
                <a href="/sellerLogin" className="text-gray-500 hover:text-primary">
                  Seller Login
                </a>
                <span className="text-gray-300">|</span>
                <a href="/admin/login" className="text-gray-500 hover:text-primary">
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

export default Login;
