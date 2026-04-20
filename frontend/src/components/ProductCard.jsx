"use client";
import React from "react";
import Link from "next/link";
import useCartContext from "@/context/CartContext";

const ProductCard = ({ product, showAddToCart = true }) => {
  const { addItemToCart, isInCart, cartItems } = useCartContext();
  const [imageError, setImageError] = React.useState(false);
  const [isAdded, setIsAdded] = React.useState(false);

  // Check if item is in cart whenever cartItems changes
  React.useEffect(() => {
    const inCart = isInCart(product._id);
    console.log(`🎯 ProductCard ${product.pname} - In cart:`, inCart);
    setIsAdded(inCart);
  }, [cartItems, product._id, isInCart]);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('🛒 Adding to cart:', product.pname);
    addItemToCart(product);
    setIsAdded(true);
  };

  const getImageSrc = () => {
    if (imageError) {
      return 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect fill="%23f0f0f0" width="200" height="200"/%3E%3Ctext fill="%23999" font-family="Arial" font-size="14" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3ENo Image%3C/text%3E%3C/svg%3E';
    }
    if (!product.images || product.images.length === 0) {
      return 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect fill="%23f0f0f0" width="200" height="200"/%3E%3Ctext fill="%23999" font-family="Arial" font-size="14" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3ENo Image%3C/text%3E%3C/svg%3E';
    }

    const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    let imagePath = product.images[0];

    // If already a full URL, use it directly
    if (imagePath.startsWith('http')) {
      return imagePath;
    }

    // Handle static/uploads/ prefix from database
    if (imagePath.startsWith('static/uploads/')) {
      return `${apiBase}/${imagePath}`;
    }

    // If path is just filename (no directory), prepend uploads
    if (!imagePath.includes('/') && !imagePath.includes('\\')) {
      return `${apiBase}/uploads/${imagePath}`;
    }

    // Otherwise assume it's a relative path and prepend API base
    return `${apiBase}/${imagePath}`;
  };

  const handleImageError = () => {
    console.warn('Image failed to load for product:', product.pname);
    console.warn('Image path from DB:', product.images?.[0]);
    setImageError(true);
  };

  const discountPercent = product.originalPrice && product.pprice
    ? Math.round(((product.originalPrice - product.pprice) / product.originalPrice) * 100)
    : product.discount || 0;

  const rating = product.rating || 4.2;
  const reviews = product.reviews || Math.floor(Math.random() * 1000) + 100;

  return (
    <Link href={`/productDetail/${product._id}`}>
      <div className="product-card bg-white group">
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden bg-gray-50 p-4">
          <img
            src={getImageSrc()}
            alt={product.pname || product.title}
            className="product-image w-full h-full object-contain"
            onError={handleImageError}
          />
          
          {/* Discount Badge */}
          {discountPercent > 0 && (
            <span className="absolute top-2 left-2 bg-accent-green text-white text-xs font-medium px-2 py-1 rounded-sm">
              {discountPercent}% OFF
            </span>
          )}

          {/* Quick Add Button - Shows on Hover */}
          {showAddToCart && (
            <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <button
                onClick={handleAddToCart}
                disabled={isAdded}
                className={`w-full py-2 rounded-sm text-sm font-medium transition-colors ${
                  isAdded
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    : 'bg-secondary hover:bg-secondary-dark text-white'
                }`}
              >
                {isAdded ? '✓ Added to Cart' : 'Add to Cart'}
              </button>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="p-4">
          {/* Brand */}
          {product.brand && (
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-1">
              {product.brand}
            </p>
          )}

          {/* Title */}
          <h3 className="text-sm font-medium text-gray-800 line-clamp-2 mb-2 min-h-[40px]">
            {product.pname || product.title}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-2">
            <span className="rating-badge">
              {rating.toFixed(1)}
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </span>
            <span className="text-xs text-gray-500">({reviews.toLocaleString()})</span>
          </div>

          {/* Price */}
          <div className="flex items-center flex-wrap gap-1">
            <span className="price-current">₹{(product.pprice || product.price || 0).toLocaleString()}</span>
            {product.originalPrice && (
              <span className="price-original">₹{product.originalPrice.toLocaleString()}</span>
            )}
            {discountPercent > 0 && (
              <span className="price-discount">{discountPercent}% off</span>
            )}
          </div>

          {/* Free Delivery Badge */}
          <p className="text-xs text-gray-500 mt-2">Free Delivery</p>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
