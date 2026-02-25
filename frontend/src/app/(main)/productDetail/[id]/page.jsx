"use client";
import useCartContext from "@/context/CartContext";
import useVoiceContext from "@/context/VoiceContext";
import useAppContext from "@/context/AppContext";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import Link from "next/link";

const ProductDetail = () => {
  const { id } = useParams();
  const router = useRouter();
  const [productDetails, setProductDetails] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [rating, setRating] = useState(5);
  const [loading, setLoading] = useState(true);
  const [pincode, setPincode] = useState("");
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [showImageZoom, setShowImageZoom] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const [expandedSection, setExpandedSection] = useState(null);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [showStickyBuy, setShowStickyBuy] = useState(false);
  const reviewRef = useRef();
  const imageRef = useRef();

  const { addItemToCart, isInCart, setCartOpen } = useCartContext();
  const { finalTranscript, voiceResponse, resetTranscript } = useVoiceContext();
  const { loggedIn, currentUser } = useAppContext();

  // Voice commands: listen for global event
  useEffect(() => {
    const listener = () => {
      if (productDetails) {
        addItemToCart({ ...productDetails, quantity });
        voiceResponse && voiceResponse(`${productDetails.pname} added to cart`);
      }
    };
    window.addEventListener("voiceAddToCart", listener);
    return () => window.removeEventListener("voiceAddToCart", listener);
  }, [productDetails, quantity]);

  // Fetch product
  useEffect(() => {
    fetchProductData();
    fetchSimilarProducts();
  }, [id]);

  // Check if product is in wishlist
  useEffect(() => {
    if (currentUser && id) {
      checkWishlistStatus();
    }
  }, [currentUser, id]);

  const checkWishlistStatus = async () => {
    try {
      const res = await fetch(`http://localhost:5000/wishlist/check/${currentUser._id}/${id}`);
      if (res.ok) {
        const data = await res.json();
        setIsWishlisted(data.isWishlisted);
      }
    } catch (error) {
      console.error("Error checking wishlist:", error);
    }
  };

  // Sticky buy button on scroll
  useEffect(() => {
    const handleScroll = () => {
      setShowStickyBuy(window.scrollY > 600);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const fetchProductData = async () => {
    try {
      const res = await fetch(`http://localhost:5000/product/getbyid/${id}`);
      if (res.ok) {
        const data = await res.json();
        setProductDetails(data);
      }
    } catch (error) {
      console.error("Error fetching product:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSimilarProducts = async () => {
    try {
      const res = await fetch(`http://localhost:5000/product/getall`);
      if (res.ok) {
        const data = await res.json();
        setSimilarProducts(data.slice(0, 8));
      }
    } catch (error) {
      console.error("Error fetching similar products:", error);
    }
  };

  const handleAddToCart = () => {
    addItemToCart({ ...productDetails, quantity });
    toast.success("Added to cart!");
  };

  const handleBuyNow = () => {
    if (!loggedIn) {
      toast.error("Please login to buy");
      router.push('/login');
      return;
    }
    addItemToCart({ ...productDetails, quantity });
    setCartOpen(false);
    router.push('/user/checkout');
  };

  const handleWishlist = async () => {
    if (!loggedIn) {
      toast.error("Please login to add to wishlist");
      router.push('/login');
      return;
    }

    try {
      if (isWishlisted) {
        // Remove from wishlist
        const res = await fetch(`http://localhost:5000/wishlist/remove/${currentUser._id}/${id}`, {
          method: 'DELETE'
        });
        if (res.ok) {
          setIsWishlisted(false);
          toast.success("Removed from wishlist");
        } else {
          toast.error("Failed to remove from wishlist");
        }
      } else {
        // Add to wishlist
        const res = await fetch(`http://localhost:5000/wishlist/add`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            userId: currentUser._id,
            productId: id
          })
        });
        if (res.ok) {
          setIsWishlisted(true);
          toast.success("Added to wishlist! ❤️");
        } else {
          toast.error("Failed to add to wishlist");
        }
      }
    } catch (error) {
      console.error("Error updating wishlist:", error);
      toast.error("Something went wrong");
    }
  };

  const handleShare = async (platform) => {
    const url = window.location.href;
    const text = `Check out ${productDetails.pname} on BolBazar!`;
    
    switch(platform) {
      case 'copy':
        navigator.clipboard.writeText(url);
        toast.success("Link copied to clipboard!");
        break;
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`, '_blank');
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
        break;
    }
  };

  const handleImageZoom = (e) => {
    if (!imageRef.current) return;
    const { left, top, width, height } = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPosition({ x, y });
  };

  const checkPincode = () => {
    if (pincode.length === 6) {
      toast.success("✅ Delivery available! Expected in 3-5 days");
    } else {
      toast.error("Please enter valid 6-digit pincode");
    }
  };

  const submitReview = async () => {
    if (!currentUser) {
      toast.error("Please login to submit a review");
      router.push('/login');
      return;
    }
    if (!reviewRef.current.value.trim()) {
      toast.error("Please write a review");
      return;
    }
    try {
      const res = await fetch(`http://localhost:5000/review/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": currentUser.token,
        },
        body: JSON.stringify({
          product: productDetails._id,
          rating: rating,
          review: reviewRef.current.value,
        }),
      });
      if (res.ok) {
        toast.success("Review submitted successfully!");
        reviewRef.current.value = "";
        setRating(5);
        fetchProductData();
      }
    } catch (error) {
      toast.error("Failed to submit review");
    }
  };

  const productHighlights = [
    { label: "Brand", value: productDetails?.brand || "Generic", icon: "🏷️" },
    { label: "Model", value: productDetails?.pname, icon: "📦" },
    { label: "Category", value: productDetails?.category ||  "General", icon: "📂" },
    { label: "Stock", value: "In Stock", icon: "✅" },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-surface py-8">
        <div className="section-container">
          <div className="bg-white rounded-sm shadow-card p-6">
            <div className="grid lg:grid-cols-5 gap-8 animate-pulse">
              <div className="lg:col-span-2 space-y-4">
                <div className="aspect-square bg-gray-200 rounded-sm" />
                <div className="flex gap-2">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="w-20 h-20 bg-gray-200 rounded-sm" />
                  ))}
                </div>
              </div>
              <div className="lg:col-span-3 space-y-4">
                <div className="h-8 bg-gray-200 rounded w-3/4" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
                <div className="h-6 bg-gray-200 rounded w-1/4" />
                <div className="h-24 bg-gray-200 rounded" />
                <div className="h-12 bg-gray-200 rounded w-full" />
                <div className="flex gap-4">
                  <div className="h-12 bg-gray-200 rounded flex-1" />
                  <div className="h-12 bg-gray-200 rounded flex-1" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!productDetails) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😢</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Product Not Found</h2>
          <Link href="/productView" className="btn-primary mt-4 inline-block">
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  const images = Array.isArray(productDetails.images) 
    ? productDetails.images 
    : [productDetails.images];

  const discountPercent = productDetails.originalPrice ? 
    Math.round(((productDetails.originalPrice - productDetails.pprice) / productDetails.originalPrice) * 100) : 
    (productDetails.discount || 0);

  return (
    <div className="min-h-screen bg-surface relative">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="section-container py-3">
          <nav className="text-sm">
            <ol className="flex items-center gap-2 text-gray-500 flex-wrap">
              <li><Link href="/" className="hover:text-primary">Home</Link></li>
              <li>/</li>
              <li><Link href="/productView" className="hover:text-primary">Products</Link></li>
              <li>/</li>
              <li className="text-gray-800 truncate max-w-[200px] sm:max-w-[400px]">{productDetails.pname}</li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="section-container  py-6">
        <div className="grid lg:grid-cols-5 gap-6">
          
          {/* Left Column - Product Images (2 cols) */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-sm shadow-sm p-4 sticky top-20">
              {/* Main Image with Zoom */}
              <div 
                ref={imageRef}
                className="relative aspect-square bg-gray-50 rounded-sm overflow-hidden mb-4 cursor-zoom-in group"
                onMouseEnter={() => setShowImageZoom(true)}
                onMouseLeave={() => setShowImageZoom(false)}
                onMouseMove={handleImageZoom}
              >
                <img
                  src={`http://localhost:5000/${images[selectedImage]}`}
                  alt={productDetails.pname}
                  className="w-full h-full object-contain p-6 transition-transform duration-200"
                  style={showImageZoom ? {
                    transform: 'scale(1.8)',
                    transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`
                  } : {}}
                />
                
                {/* Wishlist & Share Buttons */}
                <div className="absolute top-3 right-3 flex gap-2 z-10">
                  <button
                    onClick={handleWishlist}
                    className="bg-white/95 backdrop-blur rounded-full p-2.5 shadow-md hover:shadow-lg transition-all group/heart"
                    title="Add to Wishlist"
                  >
                    <svg className={`w-6 h-6 transition-all ${isWishlisted ? 'fill-red-500 text-red-500 scale-110' : 'text-gray-600'} group-hover/heart:text-red-500 group-hover/heart:scale-110`} fill={isWishlisted ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </button>
                  
                  <div className="relative group/share">
                    <button className="bg-white/95 backdrop-blur rounded-full p-2.5 shadow-md hover:shadow-lg transition-all" title="Share">
                      <svg className="w-6 h-6 text-gray-600 group-hover/share:text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                      </svg>
                    </button>
                    
                    {/* Share Dropdown */}
                    <div className="absolute right-0 top-full mt-2 bg-white rounded-lg shadow-xl border border-gray-100 p-2 opacity-0 invisible group-hover/share:opacity-100 group-hover/share:visible transition-all z-20 w-48">
                      <button onClick={() => handleShare('copy')} className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-gray-50 text-sm text-gray-700 rounded transition-colors">
                        <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        <span className="font-medium">Copy Link</span>
                      </button>
                      <button onClick={() => handleShare('whatsapp')} className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-gray-50 text-sm text-gray-700 rounded transition-colors">
                        <span className="text-xl">📱</span>
                        <span className="font-medium">WhatsApp</span>
                      </button>
                      <button onClick={() => handleShare('facebook')} className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-gray-50 text-sm text-gray-700 rounded transition-colors">
                        <span className="text-xl">👥</span>
                        <span className="font-medium">Facebook</span>
                      </button>
                      <button onClick={() => handleShare('twitter')} className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-gray-50 text-sm text-gray-700 rounded transition-colors">
                        <span className="text-xl">🐦</span>
                        <span className="font-medium">Twitter</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Discount Badge */}
                {discountPercent > 0 && (
                  <span className="absolute top-3 left-3 bg-accent-green text-white text-sm font-bold px-3 py-1.5 rounded-sm shadow-lg z-10">
                    {discountPercent}% OFF
                  </span>
                )}

                {/* Zoom Hint */}
                {showImageZoom && (
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/75 text-white text-xs px-3 py-1.5 rounded-full">
                    🔍 Move mouse to zoom
                  </div>
                )}
              </div>

              {/* Thumbnail Gallery */}
              {images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(idx)}
                      className={`flex-shrink-0 w-20 h-20 rounded-sm border-2 overflow-hidden transition-all ${
                        selectedImage === idx 
                          ? 'border-primary shadow-md scale-105' 
                          : 'border-gray-200 opacity-60 hover:opacity-100 hover:border-primary/50'
                      }`}
                    >
                      <img
                        src={`http://localhost:5000/${img}`}
                        alt={`View ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* Action Buttons (Desktop) */}
              <div className="hidden lg:flex gap-3 mt-6">
                <button
                  onClick={handleAddToCart}
                  disabled={isInCart && isInCart(productDetails._id)}
                  className={`flex-1 py-3.5 px-4 rounded-sm font-semibold transition-all flex items-center justify-center gap-2 ${
                    isInCart && isInCart(productDetails._id)
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      : 'bg-secondary hover:bg-secondary-dark text-white shadow-md hover:shadow-lg transform hover:scale-[1.02]'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  {isInCart && isInCart(productDetails._id) ? '✓ In Cart' : 'Add to Cart'}
                </button>
                <button
                  onClick={handleBuyNow}
                  className="flex-1 py-3.5 px-4 bg-accent-orange hover:opacity-90 text-white font-bold rounded-sm transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 transform hover:scale-[1.02]"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Buy Now
                </button>
              </div>
            </div>
          </div>

          {/* Right Column - Product Info (3 cols) */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-sm shadow-sm p-6">
              
              {/* Brand */}
              {productDetails.brand && (
                <Link href={`/productView?brand=${productDetails.brand}`} className="inline-block text-sm text-gray-500 uppercase tracking-wide mb-2 hover:text-primary transition-colors">
                  {productDetails.brand}
                </Link>
              )}

              {/* Title */}
              <h1 className="text-2xl lg:text-3xl font-semibold text-gray-900 mb-3 leading-tight">
                {productDetails.pname}
              </h1>

              {/* Rating & Reviews */}
              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100">
                <div className="flex items-center gap-2 bg-accent-green text-white px-3 py-1.5 rounded-sm text-sm font-semibold">
                  <span>{(productDetails.rating || 4.2).toFixed(1)}</span>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
                <span className="text-gray-500">
                  <span className="font-semibold text-gray-700">{productDetails.reviews?.length || 128}</span> Ratings & Reviews
                </span>
              </div>

              {/* Price Section */}
              <div className="mb-6 pb-6 border-b border-gray-100">
                <div className="flex items-baseline gap-3 flex-wrap mb-2">
                  <span className="text-3xl lg:text-4xl font-bold text-gray-900">
                    ₹{productDetails.pprice?.toLocaleString()}
                  </span>
                  {productDetails.originalPrice && (
                    <>
                      <span className="text-xl text-gray-400 line-through">
                        ₹{productDetails.originalPrice.toLocaleString()}
                      </span>
                      <span className="text-xl text-accent-green font-bold">
                        {discountPercent}% off
                      </span>
                    </>
                  )}
                </div>
                <p className="text-sm text-gray-500">+ ₹50 Shipping Fee | Inclusive of all taxes</p>
                
                {/* Special Offer */}
                <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-sm p-3">
                  <p className="text-sm font-semibold text-yellow-800 mb-1">🎉 Special Offer</p>
                  <p className="text-sm text-yellow-700">Get extra 10% off (up to ₹500) on payment via HDFC Bank Cards</p>
                </div>
              </div>

              {/* Available Offers */}
              <div className="mb-6 pb-6 border-b border-gray-100">
                <h3 className="font-semibold text-gray-900 mb-3 text-lg">Available Offers</h3>
                <div className="space-y-2.5">
                  {[
                    { icon: "💳", text: "Bank Offer: Flat 10% discount on HDFC Bank Credit Cards" },
                    { icon: "🚚", text: "Free Delivery on orders above ₹499" },
                    { icon: "↩️", text: "Easy 10 days return and exchange policy" },
                    { icon: "🎁", text: "Buy 2 Get 1 Free on selected items" }
                  ].map((offer, idx) => (
                    <div key={idx} className="flex items-start gap-3 text-sm">
                      <span className="text-xl flex-shrink-0">{offer.icon}</span>
                      <span className="text-gray-700">{offer.text}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Delivery Details */}
              <div className="mb-6 pb-6 border-b border-gray-100">
                <h3 className="font-semibold text-gray-900 mb-3 text-lg">Delivery Options</h3>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="Enter Pincode"
                    className="flex-1 px-4 py-2.5 border border-gray-300 rounded-sm focus:ring-2 focus:ring-primary/30 focus:border-primary text-sm"
                    maxLength={6}
                  />
                  <button 
                    onClick={checkPincode}
                    className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-sm transition-colors text-sm"
                  >
                    Check
                  </button>
                </div>
                {pincode.length === 6 && (
                  <div className="mt-3 space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-gray-700">
                      <svg className="w-5 h-5 text-accent-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Delivery by <strong>Feb 18, 2026</strong></span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                      <svg className="w-5 h-5 text-accent-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Cash on Delivery available</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Seller Info */}
              {productDetails.seller && (
                <div className="mb-6 pb-6 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Sold by</p>
                      <p className="font-semibold text-gray-900 text-lg">
                        {productDetails.seller.fname} {productDetails.seller.lname}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="bg-accent-green text-white text-xs px-2 py-0.5 rounded-sm font-semibold">4.3★</span>
                        <span className="text-xs text-gray-500">Verified Seller</span>
                      </div>
                    </div>
                    <button className="text-primary hover:underline text-sm font-medium">
                      View Shop
                    </button>
                  </div>
                </div>
              )}

              {/* Quantity Selector */}
              <div className="flex items-center gap-6 mb-6 pb-6 border-b border-gray-100">
                <span className="text-gray-700 font-medium">Quantity:</span>
                <div className="flex items-center border-2 border-gray-200 rounded-sm overflow-hidden">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 transition-colors font-bold text-gray-600"
                  >
                    −
                  </button>
                  <span className="w-14 text-center font-semibold text-gray-900 border-x-2 border-gray-200 h-10 flex items-center justify-center">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 transition-colors font-bold text-gray-600"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Product Highlights Accordion */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3 text-lg">Product Highlights</h3>
                <div className="grid grid-cols-2 gap-3">
                  {productHighlights.map((item, idx) => (
                    <div key={idx} className="bg-gray-50 rounded-sm p-3 border border-gray-100">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-lg">{item.icon}</span>
                        <span className="text-sm text-gray-500">{item.label}</span>
                      </div>
                      <p className="text-sm font-semibold text-gray-900 truncate">{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons (Mobile) */}
              <div className="flex lg:hidden gap-3 mt-6">
                <button
                  onClick={handleAddToCart}
                  disabled={isInCart && isInCart(productDetails._id)}
                  className={`flex-1 py-3.5 px-4 rounded-sm font-semibold transition-all flex items-center justify-center gap-2 ${
                    isInCart && isInCart(productDetails._id)
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      : 'bg-secondary hover:bg-secondary-dark text-white shadow-md'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  {isInCart && isInCart(productDetails._id) ? 'In Cart' : 'Add'}
                </button>
                <button
                  onClick={handleBuyNow}
                  className="flex-1 py-3.5 px-4 bg-accent-orange hover:opacity-90 text-white font-bold rounded-sm transition-all shadow-md flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Buy Now
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Product Description */}
        <div className="mt-6 bg-white rounded-sm shadow-sm p-6">
          <button
            onClick={() => setExpandedSection(expandedSection === 'description' ? null : 'description')}
            className="w-full flex items-center justify-between text-left"
          >
            <h2 className="text-xl font-semibold text-gray-900">Product Description</h2>
            <svg className={`w-6 h-6 text-gray-400 transition-transform ${expandedSection === 'description' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {(expandedSection === 'description' || expandedSection === null) && (
            <div className="mt-4 text-gray-700 leading-relaxed whitespace-pre-line">
              {productDetails.pdetail}
            </div>
          )}
        </div>

        {/* Ratings & Reviews Section */}
        <div className="mt-6 bg-white rounded-sm shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Ratings & Reviews</h2>
          
          {/* Overall Rating Summary */}
          <div className="grid md:grid-cols-2 gap-6 mb-8 pb-8 border-b border-gray-100">
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="text-5xl font-bold text-gray-900 mb-2">
                  {(productDetails.rating || 4.2).toFixed(1)}
                </div>
                <div className="flex gap-0.5 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className={`w-5 h-5 ${i < Math.round(productDetails.rating || 4.2) ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-sm text-gray-500">{productDetails.reviews?.length || 128} reviews</p>
              </div>
            </div>
            
            {/* Rating Breakdown */}
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((star) => (
                <div key={star} className="flex items-center gap-3">
                  <span className="text-sm text-gray-600w-3">{star}★</span>
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-accent-green rounded-full" 
                      style={{width: `${Math.random() * 60 + 20}%`}}
                    />
                  </div>
                  <span className="text-sm text-gray-500 w-12 text-right">{Math.floor(Math.random() * 50)}</span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Write Review */}
          {loggedIn ? (
            <div className="border border-gray-200 rounded-sm p-6 mb-8 bg-gray-50">
              <h3 className="font-semibold text-gray-800 mb-4">Write a Review</h3>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-sm text-gray-600">Your Rating:</span>
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    className={`text-3xl transition-all ${star <= rating ? 'text-yellow-400 scale-110' : 'text-gray-300 hover:text-yellow-200'}`}
                  >
                    ★
                  </button>
                ))}
                <span className="ml-2 text-sm font-semibold text-gray-700">({rating}/5)</span>
              </div>
              <textarea
                ref={reviewRef}
                placeholder="Share your experience with this product... (minimum 10 characters)"
                className="w-full border border-gray-300 rounded-sm p-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary resize-none"
                rows={4}
              />
              <button
                onClick={submitReview}
                className="mt-4 bg-primary hover:bg-primary-dark text-white font-semibold py-2.5 px-8 rounded-sm transition-colors"
              >
                Submit Review
              </button>
            </div>
          ) : (
            <div className="border border-gray-200 rounded-sm p-8 mb-8 text-center bg-gray-50">
              <p className="text-gray-600 mb-3">Login to write a review and help others!  </p>
              <Link href="/login" className="inline-block bg-primary hover:bg-primary-dark text-white font-semibold py-2.5 px-8 rounded-sm transition-colors">
                Login Now
              </Link>
            </div>
          )}

          {/* Reviews List */}
          <div className="space-y-6">
            {productDetails.reviews && productDetails.reviews.length > 0 ? (
              productDetails.reviews.slice(0, 5).map((review, idx) => (
                <div key={idx} className="border-b border-gray-100 pb-6 last:border-0">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center font-semibold text-primary">
                        {review.user?.name?.[0] || 'A'}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{review.user?.name || 'Anonymous'}</p>
                        <div className="flex items-center gap-2">
                          <div className="flex gap-0.5">
                            {[...Array(5)].map((_, i) => (
                              <svg key={i} className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                          <span className="text-xs text-gray-500">Verified Purchase</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-700 leading-relaxed mb-3">{review.review}</p>
                  <div className="flex items-center gap-4 text-sm">
                    <button className="flex items-center gap-1 text-gray-500 hover:text-gray-700 transition-colors">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                      </svg>
                      Helpful ({Math.floor(Math.random() * 20)})
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <div className="text-5xl mb-3">📝</div>
                <p className="text-gray-500">No reviews yet. Be the first to review!</p>
              </div>
            )}
          </div>

          {productDetails.reviews && productDetails.reviews.length > 5 && (
            <button className="mt-6 w-full py-3 border-2 border-primary text-primary hover:bg-primary hover:text-white font-semibold rounded-sm transition-colors">
              View All {productDetails.reviews.length} Reviews
            </button>
          )}
        </div>

        {/* Q&A Section */}
        <div className="mt-6 bg-white rounded-sm shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Questions & Answers</h2>
          
          <div className="space-y-6 mb-6">
            {[
              { q: "Is this product genuine?", a: "Yes, 100% authentic product with manufacturer warranty." },
              { q: "What is the warranty period?", a: "1 year manufacturer warranty included." },
              { q: "Is cash on delivery available?", a: "Yes, COD is available for this product." }
            ].map((qa, idx) => (
              <div key={idx} className="border-b border-gray-100 pb-6 last:border-0">
                <div className="flex items-start gap-3 mb-3">
                  <span className="text-primary font-bold text-lg flex-shrink-0">Q:</span>
                  <p className="font-medium text-gray-900">{qa.q}</p>
                </div>
                <div className="flex items-start gap-3 ml-8">
                  <span className="text-accent-green font-bold text-lg flex-shrink-0">A:</span>
                  <p className="text-gray-700">{qa.a}</p>
                </div>
              </div>
            ))}
          </div>

          <button className="w-full py-3 border-2 border-gray-300 text-gray-700 hover:border-primary hover:text-primary font-semibold rounded-sm transition-colors">
            Ask a Question
          </button>
        </div>

        {/* Similar Products */}
        {similarProducts.length > 0 && (
          <div className="mt-6 bg-white rounded-sm shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Similar Products</h2>
              <Link href="/productView" className="text-primary hover:underline font-medium text-sm">
                View All
              </Link>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {similarProducts.map((product) => (
                <Link
                  key={product._id}
                  href={`/productDetail/${product._id}`}
                  className="border border-gray-200 rounded-sm p-3 hover:shadow-lg transition-all group"
                >
                  <div className="aspect-square bg-gray-50 rounded-sm overflow-hidden mb-3">
                    <img
                      src={`http://localhost:5000/${Array.isArray(product.images) ? product.images[0] : product.images}`}
                      alt={product.pname}
                      className="w-full h-full object-contain p-2 group-hover:scale-110 transition-transform"
                    />
                  </div>
                  <h3 className="text-sm font-medium text-gray-900 mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                    {product.pname}
                  </h3>
                  <div className="flex items-baseline gap-2">
                    <span className="text-lg font-bold text-gray-900">
                      ₹{product.pprice?.toLocaleString()}
                    </span>
                    {product.originalPrice && (
                      <span className="text-xs text-gray-400 line-through">
                        ₹{product.originalPrice.toLocaleString()}
                      </span>
                    )}
                  </div>
                  {product.discount && (
                    <span className="text-xs text-accent-green font-semibold">
                      {product.discount}% off
                    </span>
                  )}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Sticky Buy Button (Mobile) */}
      {showStickyBuy && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-gray-200 p-3 shadow-2xl z-40 lg:hidden animate-slide-up">
          <div className="flex gap-3">
            <button
              onClick={handleAddToCart}
              disabled={isInCart && isInCart(productDetails._id)}
              className={`flex-1 py-3 px-4 rounded-sm font-semibold transition-colors flex items-center justify-center gap-2 ${
                isInCart && isInCart(productDetails._id)
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  : 'bg-secondary hover:bg-secondary-dark text-white'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {isInCart && isInCart(productDetails._id) ? 'In Cart' : 'Add'}
            </button>
            <button
              onClick={handleBuyNow}
              className="flex-1 py-3 px-4 bg-accent-orange text-white font-bold rounded-sm flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Buy Now
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;

