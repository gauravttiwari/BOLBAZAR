"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import useCartContext from "@/context/CartContext";
import useVoiceContext from "@/context/VoiceContext";
import ProductCard from "@/components/ProductCard";
import Link from "next/link";

const categories = [
  {
    id: 1,
    name: "Electronics",
    icon: "📱",
    color: "from-emerald-500 to-teal-600",
    subcategories: ["Mobiles", "Laptops", "Cameras", "Gaming", "Accessories"]
  },
  {
    id: 2,
    name: "Fashion",
    icon: "👕",
    color: "from-pink-500 to-rose-600",
    subcategories: ["Men's Clothing", "Women's Clothing", "Kids Wear", "Footwear", "Watches"]
  },
  {
    id: 3,
    name: "Home & Furniture",
    icon: "🏠",
    color: "from-amber-500 to-orange-600",
    subcategories: ["Furniture", "Home Decor", "Kitchen", "Furnishing", "Lighting"]
  },
  {
    id: 4,
    name: "Appliances",
    icon: "🔌",
    color: "from-teal-500 to-cyan-600",
    subcategories: ["TV", "Washing Machine", "AC", "Refrigerator", "Kitchen Appliances"]
  },
  {
    id: 5,
    name: "Beauty",
    icon: "💄",
    color: "from-rose-500 to-pink-600",
    subcategories: ["Makeup", "Skincare", "Haircare", "Fragrances", "Personal Care"]
  },
  {
    id: 6,
    name: "Sports",
    icon: "⚽",
    color: "from-green-500 to-emerald-600",
    subcategories: ["Sports Equipment", "Fitness", "Outdoor", "Sportswear", "Gym Accessories"]
  },
  {
    id: 7,
    name: "Grocery",
    icon: "🛒",
    color: "from-lime-500 to-green-600",
    subcategories: ["Staples", "Beverages", "Snacks", "Organic", "Personal Care"]
  },
  {
    id: 8,
    name: "Books & Toys",
    icon: "📚",
    color: "from-red-500 to-pink-600",
    subcategories: ["Fiction", "Non-Fiction", "Children's Books", "Toys", "Stationery"]
  }
];

const CategoryPage = () => {
  const router = useRouter();
  const { addItemToCart, cartItems, setCartOpen } = useCartContext();
  const { finalTranscript, voiceResponse, resetTranscript } = useVoiceContext();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Voice command handler (English + Hindi support)
  useEffect(() => {
    if (!finalTranscript) return;
    
    const lower = finalTranscript.toLowerCase();
    
    // Voice search (English + Hindi) - matching navbar patterns
    if (
      lower.startsWith('search:') ||
      lower.startsWith('search for') ||
      lower.startsWith('find:') ||
      lower.startsWith('find ') ||
      lower.startsWith('खोजो:') ||
      lower.startsWith('खोजो ') ||
      lower.startsWith('सर्च:') ||
      lower.startsWith('सर्च ')
    ) {
      let q = '';
      if (lower.startsWith('search:')) q = lower.split('search:')[1]?.trim();
      else if (lower.startsWith('search for')) q = lower.split('search for')[1]?.trim();
      else if (lower.startsWith('find:')) q = lower.split('find:')[1]?.trim();
      else if (lower.startsWith('find ')) q = lower.split('find ')[1]?.trim();
      else if (lower.startsWith('खोजो:')) q = lower.split('खोजो:')[1]?.trim();
      else if (lower.startsWith('खोजो ')) q = lower.split('खोजो ')[1]?.trim();
      else if (lower.startsWith('सर्च:')) q = lower.split('सर्च:')[1]?.trim();
      else if (lower.startsWith('सर्च ')) q = lower.split('सर्च ')[1]?.trim();
      
      if (q) {
        voiceResponse(`Searching for ${q}`);
        router.push(`/productView?search=${encodeURIComponent(q)}`);
        resetTranscript();
      }
    }
    // Voice browse category (English + Hindi)
    else if (
      lower.includes('browse') ||
      lower.includes('category:') ||
      lower.includes('show me') ||
      lower.includes('श्रेणी:') ||
      lower.includes('दिखाएं')
    ) {
      let category = '';
      
      // Match category names
      if (lower.includes('electronics') || lower.includes('इलेक्ट्रॉनिक्स')) {
        category = 'electronics';
      } else if (lower.includes('fashion') || lower.includes('फैशन')) {
        category = 'fashion';
      } else if (lower.includes('home') || lower.includes('furniture') || lower.includes('घर')) {
        category = 'home & furniture';
      } else if (lower.includes('appliances') || lower.includes('उपकरण')) {
        category = 'appliances';
      } else if (lower.includes('beauty') || lower.includes('सौंदर्य')) {
        category = 'beauty';
      } else if (lower.includes('sports') || lower.includes('खेल')) {
        category = 'sports';
      } else if (lower.includes('grocery') || lower.includes('किराना')) {
        category = 'grocery';
      } else if (lower.includes('books') || lower.includes('toys') || lower.includes('किताबें')) {
        category = 'books & toys';
      }
      
      if (category) {
        voiceResponse(`Browsing ${category}`);
        router.push(`/productView?category=${encodeURIComponent(category)}`);
        resetTranscript();
      }
    }
    // Voice open cart (English + Hindi)
    else if (
      lower.includes('open cart') ||
      lower.includes('view cart') ||
      lower.includes('show cart') ||
      lower.includes('कार्ट') ||
      lower.includes('कार्ट खोलें')
    ) {
      voiceResponse('Opening your cart');
      setCartOpen(true);
      resetTranscript();
    }
    // Voice close/hide menu (English + Hindi)
    else if (
      lower.includes('close menu') ||
      lower.includes('back') ||
      lower.includes('मेनू बंद करें')
    ) {
      setSelectedCategory(null);
      voiceResponse('Menu closed');
      resetTranscript();
    }
  }, [finalTranscript]);

  // Fetch products
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:5000/product/getall');
      const data = await response.json();
      setProducts(data.slice(0, 12));
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="section-container py-6">
          <h1 className="text-2xl font-bold text-gray-900">All Categories</h1>
          <p className="text-gray-500 mt-1 text-sm">Explore our wide range of products</p>
        </div>
      </div>

      {/* Categories Grid */}
      <section className="py-6">
        <div className="section-container">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {categories.map((category) => (
              <div
                key={category.id}
                className="group relative"
                onMouseEnter={() => setSelectedCategory(category.id)}
                onMouseLeave={() => setSelectedCategory(null)}
              >
                <Link href={`/productView?category=${category.name.toLowerCase()}`}>
                  <div className={`bg-gradient-to-br ${category.color} rounded-sm p-6 text-white cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-[1.02]`}>
                    <div className="text-4xl mb-3">{category.icon}</div>
                    <h3 className="font-semibold text-lg">{category.name}</h3>
                    <p className="text-sm text-white/80 mt-1">{category.subcategories.length} subcategories</p>
                  </div>
                </Link>

                {/* Subcategory Dropdown */}
                {selectedCategory === category.id && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-sm shadow-card-hover border border-gray-100 py-2 z-20 animate-in fade-in slide-in-from-top-1 duration-200">
                    {category.subcategories.map((sub, idx) => (
                      <Link
                        key={idx}
                        href={`/productView?category=${category.name.toLowerCase()}&subcategory=${sub.toLowerCase()}`}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-primary/5 hover:text-primary transition-colors"
                      >
                        {sub}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Promotional Banner */}
      <section className="py-4">
        <div className="section-container">
          <div className="bg-primary rounded-sm p-8 text-white relative overflow-hidden">
            <div className="relative z-10 max-w-xl">
              <h2 className="text-2xl sm:text-3xl font-bold mb-2">Special Offers</h2>
              <p className="text-emerald-100 mb-4">Get up to 70% OFF on selected categories this week!</p>
              <Link href="/productView" className="btn-secondary inline-block">
                Shop Now →
              </Link>
            </div>
            {/* Decorative */}
            <div className="absolute -right-10 top-1/2 -translate-y-1/2 text-[150px] opacity-20">🎁</div>
          </div>
        </div>
      </section>

      {/* Popular Brands */}
      <section className="py-6">
        <div className="section-container">
          <div className="bg-white rounded-sm p-4 shadow-card">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Popular Brands</h2>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
              {['Samsung', 'Apple', 'Nike', 'Adidas', 'Sony', 'LG'].map((brand, idx) => (
                <Link key={idx} href={`/productView?brand=${brand.toLowerCase()}`}>
                  <div className="bg-surface rounded-sm p-4 flex items-center justify-center hover:shadow-md hover:bg-white transition-all cursor-pointer h-16">
                    <span className="font-semibold text-gray-700">{brand}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Trending Products */}
      <section className="py-6">
        <div className="section-container">
          <div className="bg-white rounded-sm p-4 shadow-card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800">Trending Products</h2>
              <Link href="/productView" className="text-primary text-sm font-medium hover:underline">
                View All →
              </Link>
            </div>
            
            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                {[...Array(6)].map((_, idx) => (
                  <div key={idx} className="animate-pulse">
                    <div className="aspect-square bg-gray-200 rounded-sm mb-3" />
                    <div className="h-4 bg-gray-200 rounded mb-2" />
                    <div className="h-4 bg-gray-200 rounded w-2/3" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                {products.slice(0, 6).map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Flash Sale Banner */}
      <section className="py-6">
        <div className="section-container">
          <div className="bg-gradient-to-r from-secondary to-accent-orange rounded-sm p-8 text-white relative overflow-hidden">
            <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">⚡</span>
                  <h2 className="text-2xl font-bold">Flash Sale</h2>
                </div>
                <p className="text-orange-100">Limited time offer - Don't miss out!</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-center bg-white/20 rounded-sm px-4 py-2">
                  <span className="text-2xl font-bold">12</span>
                  <p className="text-xs">Hours</p>
                </div>
                <span className="text-2xl">:</span>
                <div className="text-center bg-white/20 rounded-sm px-4 py-2">
                  <span className="text-2xl font-bold">45</span>
                  <p className="text-xs">Mins</p>
                </div>
                <span className="text-2xl">:</span>
                <div className="text-center bg-white/20 rounded-sm px-4 py-2">
                  <span className="text-2xl font-bold">30</span>
                  <p className="text-xs">Secs</p>
                </div>
              </div>
              <Link href="/productView" className="bg-white text-secondary px-6 py-2.5 rounded-sm font-medium hover:bg-gray-100 transition-colors">
                Shop Deals
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* More Products */}
      <section className="py-6">
        <div className="section-container">
          <div className="bg-white rounded-sm p-4 shadow-card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800">More to Explore</h2>
              <Link href="/productView" className="text-primary text-sm font-medium hover:underline">
                View All →
              </Link>
            </div>
            
            {!loading && (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                {products.slice(6, 12).map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default CategoryPage;

