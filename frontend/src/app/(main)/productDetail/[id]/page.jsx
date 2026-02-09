"use client";
import useCartContext from "@/context/CartContext";
import useVoiceContext from "@/context/VoiceContext";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import Link from "next/link";

const ProductDetail = () => {
  const { id } = useParams();
  const router = useRouter();
  const [productDetails, setProductDetails] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [rating, setRating] = useState(5);
  const [loading, setLoading] = useState(true);
  const reviewRef = useRef();

  const { addItemToCart, isInCart, setCartOpen } = useCartContext();
  const { finalTranscript, voiceResponse, resetTranscript } = useVoiceContext();

  // Load user from sessionStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userData = sessionStorage.getItem("user");
      if (userData) {
        try {
          setCurrentUser(JSON.parse(userData));
        } catch (error) {
          console.error("Error parsing user data:", error);
        }
      }
    }
  }, []);

  // Voice commands
  useEffect(() => {
    if (finalTranscript.includes("add to cart")) {
      if (productDetails) {
        addItemToCart({ ...productDetails, quantity });
        voiceResponse(`${productDetails.pname} added to cart`);
      }
      resetTranscript();
    }
  }, [finalTranscript]);

  // Fetch product
  useEffect(() => {
    fetchProductData();
  }, [id]);

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

  const handleAddToCart = () => {
    addItemToCart({ ...productDetails, quantity });
    toast.success("Added to cart!");
  };

  const handleBuyNow = () => {
    addItemToCart({ ...productDetails, quantity });
    setCartOpen(false);
    router.push('/user/checkout');
  };

  const submitReview = async () => {
    if (!currentUser) {
      toast.error("Please login to submit a review");
      return;
    }
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/review/add`, {
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
        toast.success("Review submitted successfully");
        reviewRef.current.value = "";
        fetchProductData();
      }
    } catch (error) {
      toast.error("Failed to submit review");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-surface py-8">
        <div className="section-container">
          <div className="bg-white rounded-sm shadow-card p-6">
            <div className="grid md:grid-cols-2 gap-8 animate-pulse">
              <div className="aspect-square bg-gray-200 rounded-sm" />
              <div className="space-y-4">
                <div className="h-8 bg-gray-200 rounded w-3/4" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
                <div className="h-6 bg-gray-200 rounded w-1/4" />
                <div className="h-24 bg-gray-200 rounded" />
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
          <Link href="/productView" className="btn-primary">
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  const images = Array.isArray(productDetails.images) 
    ? productDetails.images 
    : [productDetails.images];

  return (
    <div className="min-h-screen bg-surface py-6">
      <div className="section-container">
        {/* Breadcrumb */}
        <nav className="text-sm mb-4">
          <ol className="flex items-center gap-2 text-gray-500">
            <li><Link href="/" className="hover:text-primary">Home</Link></li>
            <li>/</li>
            <li><Link href="/productView" className="hover:text-primary">Products</Link></li>
            <li>/</li>
            <li className="text-gray-800 truncate max-w-[200px]">{productDetails.pname}</li>
          </ol>
        </nav>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Left - Images */}
          <div className="bg-white rounded-sm shadow-card p-4">
            {/* Main Image */}
            <div className="relative aspect-square bg-gray-50 rounded-sm overflow-hidden mb-4">
              <img
                src={`http://localhost:5000/${images[selectedImage]}`}
                alt={productDetails.pname}
                className="w-full h-full object-contain p-4"
              />
              {productDetails.discount && (
                <span className="absolute top-3 left-3 badge-discount">
                  {productDetails.discount}% OFF
                </span>
              )}
            </div>

            {/* Thumbnail Gallery */}
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`flex-shrink-0 w-16 h-16 rounded-sm border-2 overflow-hidden transition-colors ${
                      selectedImage === idx ? 'border-primary' : 'border-gray-200'
                    }`}
                  >
                    <img
                      src={`http://localhost:5000/${img}`}
                      alt={`${productDetails.pname} ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right - Product Info */}
          <div className="bg-white rounded-sm shadow-card p-6">
            {/* Title & Rating */}
            <div className="mb-4">
              {productDetails.brand && (
                <p className="text-sm text-gray-500 uppercase tracking-wide mb-1">
                  {productDetails.brand}
                </p>
              )}
              <h1 className="text-2xl font-semibold text-gray-900 mb-2">
                {productDetails.pname}
              </h1>
              <div className="flex items-center gap-3">
                <span className="rating-badge">
                  {(productDetails.rating || 4.2).toFixed(1)}
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </span>
                <span className="text-sm text-gray-500">
                  {productDetails.reviews?.length || 128} Reviews
                </span>
              </div>
            </div>

            {/* Price */}
            <div className="border-y border-gray-100 py-4 mb-4">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold text-gray-900">
                  ₹{productDetails.pprice?.toLocaleString()}
                </span>
                {productDetails.originalPrice && (
                  <>
                    <span className="text-lg text-gray-400 line-through">
                      ₹{productDetails.originalPrice.toLocaleString()}
                    </span>
                    <span className="text-lg text-accent-green font-medium">
                      {Math.round(((productDetails.originalPrice - productDetails.pprice) / productDetails.originalPrice) * 100)}% off
                    </span>
                  </>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-1">Inclusive of all taxes</p>
            </div>

            {/* Offers */}
            <div className="mb-4">
              <h3 className="font-medium text-gray-900 mb-2">Available Offers</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <span className="text-accent-green">✓</span>
                  <span>Bank Offer: 10% off on HDFC Bank Credit Cards</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-accent-green">✓</span>
                  <span>Free Delivery on orders above ₹499</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-accent-green">✓</span>
                  <span>Easy 10 days return and exchange</span>
                </div>
              </div>
            </div>

            {/* Seller Info */}
            {productDetails.seller && (
              <div className="mb-4 p-3 bg-gray-50 rounded-sm">
                <p className="text-sm text-gray-500">Sold by</p>
                <p className="font-medium text-gray-800">
                  {productDetails.seller.fname} {productDetails.seller.lname}
                </p>
              </div>
            )}

            {/* Quantity */}
            <div className="flex items-center gap-4 mb-6">
              <span className="text-gray-700">Quantity:</span>
              <div className="flex items-center border border-gray-200 rounded-sm">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 transition-colors"
                >
                  −
                </button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mb-6">
              <button
                onClick={handleAddToCart}
                disabled={isInCart && isInCart(productDetails._id)}
                className={`flex-1 py-3 px-6 rounded-sm font-semibold transition-colors flex items-center justify-center gap-2 ${
                  isInCart && isInCart(productDetails._id)
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    : 'bg-secondary hover:bg-secondary-dark text-white'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {isInCart && isInCart(productDetails._id) ? 'Added to Cart' : 'Add to Cart'}
              </button>
              <button
                onClick={handleBuyNow}
                className="flex-1 py-3 px-6 bg-accent-orange hover:opacity-90 text-white font-semibold rounded-sm transition-opacity flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Buy Now
              </button>
            </div>

            {/* Delivery Info */}
            <div className="border border-gray-200 rounded-sm p-4">
              <div className="flex items-start gap-3">
                <svg className="w-6 h-6 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <div className="flex-1">
                  <p className="text-sm text-gray-500">Deliver to</p>
                  <p className="font-medium text-gray-800">Enter pincode for delivery details</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Description */}
        <div className="mt-6 bg-white rounded-sm shadow-card p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Product Description</h2>
          <p className="text-gray-600 leading-relaxed whitespace-pre-line">
            {productDetails.pdetail}
          </p>
        </div>

        {/* Reviews Section */}
        <div className="mt-6 bg-white rounded-sm shadow-card p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Ratings & Reviews</h2>
          
          {/* Add Review */}
          {currentUser ? (
            <div className="border border-gray-200 rounded-sm p-4 mb-6">
              <h3 className="font-medium text-gray-800 mb-3">Write a Review</h3>
              <div className="flex items-center gap-2 mb-3">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    className={`text-2xl ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
                  >
                    ★
                  </button>
                ))}
              </div>
              <textarea
                ref={reviewRef}
                placeholder="Share your experience with this product..."
                className="w-full border border-gray-200 rounded-sm p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                rows={3}
              />
              <button
                onClick={submitReview}
                className="mt-3 btn-primary"
              >
                Submit Review
              </button>
            </div>
          ) : (
            <div className="border border-gray-200 rounded-sm p-4 mb-6 text-center">
              <p className="text-gray-500 mb-2">Login to write a review</p>
              <Link href="/login" className="text-primary font-medium hover:underline">
                Login Now
              </Link>
            </div>
          )}

          {/* Reviews List */}
          {productDetails.reviews?.length > 0 ? (
            <div className="space-y-4">
              {productDetails.reviews.map((review, idx) => (
                <div key={idx} className="border-b border-gray-100 pb-4 last:border-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="rating-badge">
                      {review.rating}
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </span>
                    <span className="text-sm text-gray-500">{review.user?.name || 'Anonymous'}</span>
                  </div>
                  <p className="text-gray-700 text-sm">{review.review}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No reviews yet. Be the first to review!</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;

