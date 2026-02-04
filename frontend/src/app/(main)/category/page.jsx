"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import useCartContext from "@/context/CartContext";
import useVoiceContext from "@/context/VoiceContext";

const CategoryPage = () => {
  const router = useRouter();
  const { addItemToCart, cartItems, setCartOpen } = useCartContext();
  const { finalTranscript, voiceResponse, resetTranscript } = useVoiceContext();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addedToCart, setAddedToCart] = useState({});

  // Voice command handler
  useEffect(() => {
    const transcript = finalTranscript.toLowerCase();
    
    // Search products by name
    if (transcript.includes('search') || transcript.includes('show me')) {
      const searchTerm = transcript.replace('search', '').replace('show me', '').trim();
      if (searchTerm) {
        voiceResponse(`Searching for ${searchTerm}`);
        router.push(`/productView?search=${searchTerm}`);
        resetTranscript();
      }
    }
    
    // Add product to cart by name
    else if (transcript.includes('add') && (transcript.includes('cart') || transcript.includes('product'))) {
      // Extract product name from command
      let productName = transcript
        .replace('add', '')
        .replace('to cart', '')
        .replace('product', '')
        .replace('to', '')
        .trim();
      
      if (productName) {
        // Find product by name (fuzzy match)
        const foundProduct = products.find(product => 
          product.pname?.toLowerCase().includes(productName.toLowerCase()) ||
          product.category?.toLowerCase().includes(productName.toLowerCase())
        );
        
        if (foundProduct) {
          handleAddToCart(null, foundProduct);
          voiceResponse(`Added ${foundProduct.pname} to cart`);
          resetTranscript();
        } else {
          voiceResponse(`Sorry, I couldn't find ${productName}. Please try again with a different name.`);
          resetTranscript();
        }
      }
    }
    
    // Open cart
    else if (transcript.includes('open cart') || transcript.includes('view cart') || transcript.includes('show cart')) {
      voiceResponse('Opening your cart');
      setCartOpen(true);
      resetTranscript();
    }
    
    // Go to checkout
    else if (transcript.includes('checkout') || transcript.includes('place order')) {
      if (cartItems.length > 0) {
        voiceResponse('Taking you to checkout');
        router.push('/user/checkout');
        resetTranscript();
      } else {
        voiceResponse('Your cart is empty. Please add some products first');
        resetTranscript();
      }
    }
    
    // Navigate to category
    else if (transcript.includes('show') && transcript.includes('category')) {
      const categories = ['electronics', 'fashion', 'mobiles', 'appliances', 'grocery'];
      const foundCategory = categories.find(cat => transcript.includes(cat));
      if (foundCategory) {
        voiceResponse(`Showing ${foundCategory} products`);
        router.push(`/productView?category=${foundCategory}`);
        resetTranscript();
      }
    }
  }, [finalTranscript]);

  // Handle add to cart
  const handleAddToCart = (e, product) => {
    if (e) e.stopPropagation(); // Prevent navigation to product detail
    addItemToCart(product);
    
    // Show feedback
    setAddedToCart(prev => ({ ...prev, [product._id]: true }));
    setTimeout(() => {
      setAddedToCart(prev => ({ ...prev, [product._id]: false }));
    }, 2000);
  };

  // Fetch products from backend
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:5000/product/getall');
      const data = await response.json();
      setProducts(data.slice(0, 12)); // Show first 12 products
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      setLoading(false);
    }
  };

  const categories = [
    {
      id: 1,
      name: "Electronics",
      icon: "📱",
      image: "https://rukminim2.flixcart.com/flap/80/80/image/69c6589653afdb9a.png?q=100",
      subcategories: ["Mobiles", "Laptops", "Cameras", "Gaming", "Accessories"]
    },
    {
      id: 2,
      name: "Fashion",
      icon: "👗",
      image: "https://rukminim2.flixcart.com/fk-p-flap/80/80/image/0d75b34f7d8fbcb3.png?q=100",
      subcategories: ["Men's Clothing", "Women's Clothing", "Kids Wear", "Footwear", "Watches"]
    },
    {
      id: 3,
      name: "Home & Furniture",
      icon: "🛋️",
      image: "https://rukminim2.flixcart.com/flap/80/80/image/ab7e2b022a4587dd.jpg?q=100",
      subcategories: ["Furniture", "Home Decor", "Kitchen", "Furnishing", "Lighting"]
    },
    {
      id: 4,
      name: "Appliances",
      icon: "🔌",
      image: "https://rukminim2.flixcart.com/fk-p-flap/80/80/image/0139228b2f7eb413.jpg?q=100",
      subcategories: ["TV", "Washing Machine", "AC", "Refrigerator", "Kitchen Appliances"]
    },
    {
      id: 5,
      name: "Beauty & Toys",
      icon: "💄",
      image: "https://rukminim2.flixcart.com/flap/80/80/image/dff3f7adcf3a90c6.png?q=100",
      subcategories: ["Beauty", "Toys", "Baby Care", "Kids Fashion", "Stationery"]
    },
    {
      id: 6,
      name: "Sports & Books",
      icon: "⚽",
      image: "https://rukminim2.flixcart.com/flap/80/80/image/71050627a56b4693.png?q=100",
      subcategories: ["Sports", "Fitness", "Books", "Music", "Games"]
    },
    {
      id: 7,
      name: "Grocery",
      icon: "🛒",
      image: "https://rukminim2.flixcart.com/flap/80/80/image/29327f40e9c4d26b.png?q=100",
      subcategories: ["Staples", "Beverages", "Snacks", "Organic", "Personal Care"]
    },
    {
      id: 8,
      name: "Mobiles",
      icon: "📱",
      image: "https://rukminim2.flixcart.com/flap/80/80/image/22fddf3c7da4c4f4.png?q=100",
      subcategories: ["Samsung", "Apple", "Xiaomi", "Realme", "Oppo"]
    }
  ];

  const [hoveredCategory, setHoveredCategory] = useState(null);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">All Categories</h1>
          <p className="text-gray-600 mt-2">Shop by Category</p>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4">
          {categories.map((category) => (
            <div
              key={category.id}
              className="relative group"
              onMouseEnter={() => setHoveredCategory(category.id)}
              onMouseLeave={() => setHoveredCategory(null)}
            >
              {/* Category Card */}
              <div className="bg-white rounded-lg shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden border border-gray-200 hover:border-blue-500">
                <div className="p-6 text-center">
                  {/* Icon/Image */}
                  <div className="mb-4 flex justify-center">
                    {category.image ? (
                      <img 
                        src={category.image} 
                        alt={category.name}
                        className="w-20 h-20 object-contain"
                      />
                    ) : (
                      <div className="text-6xl">{category.icon}</div>
                    )}
                  </div>
                  
                  {/* Category Name */}
                  <h3 className="text-lg font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                    {category.name}
                  </h3>
                  
                  {/* Subcategory Count */}
                  <p className="text-sm text-gray-500 mt-1">
                    {category.subcategories.length} subcategories
                  </p>
                </div>

                {/* Hover Effect - Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </div>

              {/* Dropdown Subcategories on Hover */}
              {hoveredCategory === category.id && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-2xl border border-gray-200 p-4 z-10 animate-fadeIn">
                  <h4 className="text-sm font-bold text-gray-700 mb-2 border-b pb-2">
                    {category.name}
                  </h4>
                  <ul className="space-y-2">
                    {category.subcategories.map((sub, idx) => (
                      <li key={idx}>
                        <button
                          onClick={() => router.push(`/productView?category=${category.name}&subcategory=${sub}`)}
                          className="text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 w-full text-left px-2 py-1 rounded transition-colors"
                        >
                          {sub}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Featured Offers Section */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-8 text-white">
          <h2 className="text-3xl font-bold mb-2">🎉 Special Offers</h2>
          <p className="text-lg mb-4">Get up to 80% OFF on selected categories</p>
          <button 
            onClick={() => router.push('/productView')}
            className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Shop Now
          </button>
        </div>
      </div>

      {/* Popular Brands */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Popular Brands</h2>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
          {['Samsung', 'Apple', 'Nike', 'Adidas', 'Sony', 'LG'].map((brand, idx) => (
            <div key={idx} className="bg-white rounded-lg shadow-sm p-6 flex items-center justify-center hover:shadow-md transition-shadow cursor-pointer">
              <span className="text-lg font-semibold text-gray-700">{brand}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Trending Products Section */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Trending Products</h2>
            <p className="text-gray-600">Best deals on top products</p>
          </div>
          <button 
            onClick={() => router.push('/productView')}
            className="text-blue-600 font-semibold hover:underline"
          >
            View All →
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[...Array(12)].map((_, idx) => (
              <div key={idx} className="bg-white rounded-lg shadow-sm p-4 animate-pulse">
                <div className="bg-gray-200 h-40 rounded-lg mb-3"></div>
                <div className="bg-gray-200 h-4 rounded mb-2"></div>
                <div className="bg-gray-200 h-4 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {products.map((product) => (
              <div
                key={product._id}
                className="bg-white rounded-lg shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group border border-gray-200 hover:border-blue-500"
              >
                {/* Product Image - Clickable */}
                <div 
                  onClick={() => router.push(`/productDetail/${product._id}`)}
                  className="relative overflow-hidden bg-gray-50 cursor-pointer"
                >
                  <img
                    src={product.images?.[0] || 'https://via.placeholder.com/300'}
                    alt={product.name}
                    className="w-full h-40 object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  {/* Discount Badge */}
                  {product.discount && (
                    <div className="absolute top-2 left-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">
                      {product.discount}% OFF
                    </div>
                  )}
                  {/* Wishlist Icon */}
                  <div className="absolute top-2 right-2 bg-white rounded-full p-2 shadow-md opacity-0 group-hover:opacity-100 transition-opacity">
                    <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                </div>

                {/* Product Details */}
                <div className="p-3">
                  {/* Product Name - Clickable */}
                  <h3 
                    onClick={() => router.push(`/productDetail/${product._id}`)}
                    className="text-sm font-semibold text-gray-800 mb-1 line-clamp-2 group-hover:text-blue-600 transition-colors cursor-pointer"
                  >
                    {product.name}
                  </h3>

                  {/* Category */}
                  <p className="text-xs text-gray-500 mb-2">{product.category}</p>

                  {/* Rating */}
                  <div className="flex items-center mb-2">
                    <div className="flex items-center bg-green-600 text-white text-xs px-1.5 py-0.5 rounded">
                      <span className="font-semibold">{product.rating || 4.2}</span>
                      <svg className="w-3 h-3 ml-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </div>
                    <span className="text-xs text-gray-500 ml-1">({product.reviews || 234})</span>
                  </div>

                  {/* Price */}
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-lg font-bold text-gray-900">₹{product.price}</span>
                    {product.originalPrice && (
                      <span className="text-xs text-gray-400 line-through">₹{product.originalPrice}</span>
                    )}
                  </div>

                  {/* Free Delivery Badge */}
                  {product.price > 499 && (
                    <p className="text-xs text-green-600 font-semibold mb-2">Free Delivery</p>
                  )}

                  {/* Add to Cart Button */}
                  <button
                    onClick={(e) => handleAddToCart(e, product)}
                    className={`w-full py-2 px-3 rounded-lg font-semibold text-sm transition-all duration-300 ${
                      addedToCart[product._id]
                        ? 'bg-green-500 text-white'
                        : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700'
                    }`}
                  >
                    {addedToCart[product._id] ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Added to Cart
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        Add to Cart
                      </span>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Best Deals Banner */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl p-8 text-white relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-3xl font-bold mb-2">⚡ Flash Sale</h2>
            <p className="text-lg mb-4">Limited time offer - Grab it now!</p>
            <div className="flex gap-4">
              <button 
                onClick={() => router.push('/productView')}
                className="bg-white text-orange-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Shop Deals
              </button>
            </div>
          </div>
          {/* Decorative circles */}
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full"></div>
          <div className="absolute -right-20 -bottom-10 w-60 h-60 bg-white/10 rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;
