"use client";
import React from "react";
import Link from "next/link";
import useCartContext from "@/context/CartContext";

const ProductCard = ({ product, showAddToCart = true }) => {
  const { addItemToCart, isInCart } = useCartContext();

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addItemToCart(product);
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
            src={product.images ? `http://localhost:5000/${product.images}` : '/placeholder.png'}
            alt={product.pname || product.title}
            className="product-image w-full h-full object-contain"
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
                disabled={isInCart && isInCart(product._id)}
                className={`w-full py-2 rounded-sm text-sm font-medium transition-colors ${
                  isInCart && isInCart(product._id)
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    : 'bg-secondary hover:bg-secondary-dark text-white'
                }`}
              >
                {isInCart && isInCart(product._id) ? '✓ Added to Cart' : 'Add to Cart'}
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
