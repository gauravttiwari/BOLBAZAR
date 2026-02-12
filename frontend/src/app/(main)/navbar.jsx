"use client";
import useCartContext from "@/context/CartContext";
import useVoiceContext from "@/context/VoiceContext";
import useAppContext from "@/context/AppContext";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import CartPage from "./MyCart";

const Navbar = () => {
  const router = useRouter();
  const { cartItems, cartOpen, setCartOpen, getCartItemsCount } = useCartContext();
  const { finalTranscript, voiceResponse, resetTranscript } = useVoiceContext();
  const { loggedIn, currentUser, logout } = useAppContext();
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [loginDropdownOpen, setLoginDropdownOpen] = useState(false);

  useEffect(() => {
    if (finalTranscript.includes('open cart') || finalTranscript.includes('open card')) {
      voiceResponse('Opening cart page.');
      setCartOpen(true);
      resetTranscript();
    } else if (finalTranscript.includes('close cart') || finalTranscript.includes('close card')) {
      voiceResponse('Closing cart page');
      setCartOpen(false);
      resetTranscript();
    }
  }, [finalTranscript]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.dropdown-container')) {
        setUserDropdownOpen(false);
        // Don't auto-close login dropdown on click outside as it's hover-based
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/productView?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleLogout = () => {
    if (logout) logout();
    setUserDropdownOpen(false);
    router.push('/');
  };

  return (
    <>
      {cartOpen && <CartPage />}
      
      {/* Main Navbar */}
      <nav className="bg-primary sticky top-0 z-50 shadow-nav">
        <div className="section-container">
          <div className="flex items-center justify-between h-14 gap-4">
            
            {/* Logo */}
            <Link href="/" className="flex-shrink-0 flex items-center gap-2">
              <span className="text-2xl">🛒</span>
              <div className="hidden sm:block">
                <span className="text-white text-xl font-bold tracking-tight">BolBazar</span>
                <span className="block text-[10px] text-yellow-300 italic -mt-1">Explore Plus</span>
              </div>
            </Link>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="flex-1 max-w-2xl">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for products, brands and more"
                  className="search-input"
                />
                <button type="submit" className="absolute left-3 top-1/2 -translate-y-1/2 text-primary">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </div>
            </form>

            {/* Right Actions */}
            <div className="flex items-center gap-1 sm:gap-3">
              
              {/* User Account */}
              <div className="relative dropdown-container">
                {loggedIn ? (
                  <div>
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="hidden sm:flex items-center gap-2 text-white hover:bg-primary-dark px-3 py-2 rounded-sm transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span className="font-medium text-sm">{currentUser?.name?.split(' ')[0] || 'Account'}</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* User Dropdown - For Logged In Users */}
                  {userDropdownOpen && (
                    <div className="absolute right-0 top-full mt-1 w-56 bg-white rounded-sm shadow-lg border border-gray-100 py-2 z-50">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">{currentUser?.name}</p>
                        <p className="text-xs text-gray-500">{currentUser?.email}</p>
                      </div>
                      <Link href="/user/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setUserDropdownOpen(false)}>
                        My Profile
                      </Link>
                      <Link href="/user/ordertracking" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setUserDropdownOpen(false)}>
                        My Orders
                      </Link>
                      <Link href="/user/wishlist" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setUserDropdownOpen(false)}>
                        My Wishlist
                      </Link>
                      <Link href="/giftcards" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setUserDropdownOpen(false)}>
                        Gift Cards
                      </Link>
                      <Link href="/sellerLogin" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setUserDropdownOpen(false)}>
                        Become a Seller
                      </Link>
                      <hr className="my-1" />
                      <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                        Logout
                      </button>
                    </div>
                  )}
                  </div>
                ) : (
                  <div 
                    onMouseEnter={() => setLoginDropdownOpen(true)}
                    onMouseLeave={() => setLoginDropdownOpen(false)}
                    className="relative"
                  >
                    <button
                      onClick={() => router.push('/login')}
                      className="hidden sm:flex items-center gap-2 bg-white text-primary px-4 py-1.5 rounded-sm font-medium text-sm hover:bg-gray-100 transition-colors cursor-pointer"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Login
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {/* Login Dropdown - For Non-Logged In Users */}
                    {loginDropdownOpen && (
                      <div className="absolute right-0 top-full mt-1 w-56 bg-white rounded-sm shadow-lg border border-gray-100 py-2 z-50">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-900">New customer?</p>
                      <Link href="/signup" className="text-sm text-primary hover:underline font-medium" onClick={() => setLoginDropdownOpen(false)}>
                        Sign Up
                      </Link>
                    </div>
                    <Link href="/login" className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setLoginDropdownOpen(false)}>
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      My Profile
                    </Link>
                    <Link href="/login" className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setLoginDropdownOpen(false)}>
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                      Orders
                    </Link>
                    <Link href="/user/wishlist" className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setLoginDropdownOpen(false)}>
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                      Wishlist
                    </Link>
                    <Link href="/giftcards" className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setLoginDropdownOpen(false)}>
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                      </svg>
                      Gift Cards
                    </Link>
                    <hr className="my-1" />
                    <Link href="/sellerLogin" className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setLoginDropdownOpen(false)}>
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                      Become a Seller
                    </Link>
                    <Link href="/contact" className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setLoginDropdownOpen(false)}>
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                      24x7 Customer Care
                    </Link>
                    <Link href="/about" className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setLoginDropdownOpen(false)}>
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      About Us
                    </Link>
                  </div>
                    )}
                  </div>
                )}
              </div>

              {/* Seller Link */}
              <Link
                href="/sellerLogin"
                className="hidden lg:flex items-center gap-2 text-white hover:bg-primary-dark px-3 py-2 rounded-sm transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <span className="font-medium text-sm">Become a Seller</span>
              </Link>

              {/* Cart */}
              <button
                onClick={() => setCartOpen(!cartOpen)}
                className="relative flex items-center gap-2 text-white hover:bg-primary-dark px-3 py-2 rounded-sm transition-colors"
              >
                <div className="relative">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  {getCartItemsCount && getCartItemsCount() > 0 && (
                    <span className="absolute -top-2 -right-2 bg-secondary text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                      {getCartItemsCount()}
                    </span>
                  )}
                </div>
                <span className="hidden sm:block font-medium text-sm">Cart</span>
              </button>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden text-white p-2 hover:bg-primary-dark rounded-sm transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Secondary Nav - Categories */}
        <div className="hidden lg:block bg-white border-b border-gray-200">
          <div className="section-container">
            <div className="flex items-center gap-8 h-10 text-sm">
              <Link href="/category" className="flex items-center gap-1 text-gray-700 hover:text-primary font-medium transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                All Categories
              </Link>
              <Link href="/productView?category=electronics" className="text-gray-600 hover:text-primary transition-colors">Electronics</Link>
              <Link href="/productView?category=fashion" className="text-gray-600 hover:text-primary transition-colors">Fashion</Link>
              <Link href="/productView?category=mobiles" className="text-gray-600 hover:text-primary transition-colors">Mobiles</Link>
              <Link href="/productView?category=appliances" className="text-gray-600 hover:text-primary transition-colors">Appliances</Link>
              <Link href="/productView?category=grocery" className="text-gray-600 hover:text-primary transition-colors">Grocery</Link>
              <Link href="/about" className="text-gray-600 hover:text-primary transition-colors">About Us</Link>
              <Link href="/contact" className="text-gray-600 hover:text-primary transition-colors">Contact</Link>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-gray-200 shadow-lg">
            <div className="py-3 space-y-1">
              {!loggedIn && (
                <Link href="/login" className="block px-4 py-2 text-gray-700 hover:bg-gray-50 font-medium" onClick={() => setMobileMenuOpen(false)}>
                  Login / Sign Up
                </Link>
              )}
              {loggedIn && (
                <>
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">{currentUser?.name}</p>
                    <p className="text-xs text-gray-500">{currentUser?.email}</p>
                  </div>
                  <Link href="/user/profile" className="block px-4 py-2 text-gray-700 hover:bg-gray-50" onClick={() => setMobileMenuOpen(false)}>
                    My Profile
                  </Link>
                  <Link href="/user/ordertracking" className="block px-4 py-2 text-gray-700 hover:bg-gray-50" onClick={() => setMobileMenuOpen(false)}>
                    My Orders
                  </Link>
                </>
              )}
              <hr className="my-2" />
              <Link href="/category" className="block px-4 py-2 text-gray-700 hover:bg-gray-50" onClick={() => setMobileMenuOpen(false)}>All Categories</Link>
              <Link href="/productView?category=electronics" className="block px-4 py-2 text-gray-700 hover:bg-gray-50" onClick={() => setMobileMenuOpen(false)}>Electronics</Link>
              <Link href="/productView?category=fashion" className="block px-4 py-2 text-gray-700 hover:bg-gray-50" onClick={() => setMobileMenuOpen(false)}>Fashion</Link>
              <Link href="/productView?category=mobiles" className="block px-4 py-2 text-gray-700 hover:bg-gray-50" onClick={() => setMobileMenuOpen(false)}>Mobiles</Link>
              <Link href="/sellerLogin" className="block px-4 py-2 text-gray-700 hover:bg-gray-50" onClick={() => setMobileMenuOpen(false)}>Become a Seller</Link>
              <Link href="/contact" className="block px-4 py-2 text-gray-700 hover:bg-gray-50" onClick={() => setMobileMenuOpen(false)}>Contact Us</Link>
              {loggedIn && (
                <>
                  <hr className="my-2" />
                  <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50">
                    Logout
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;

