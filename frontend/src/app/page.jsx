"use client";
import Navbar from "./(main)/navbar";
import Footer from "./(main)/footer";
import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import CategoryCard from "@/components/CategoryCard";

// Category data
const categories = [
  { name: "Electronics", icon: "📱", href: "/productView?category=electronics" },
  { name: "Fashion", icon: "👕", href: "/productView?category=fashion" },
  { name: "Home & Furniture", icon: "🏠", href: "/productView?category=furniture" },
  { name: "Appliances", icon: "🔌", href: "/productView?category=appliances" },
  { name: "Grocery", icon: "🛒", href: "/productView?category=grocery" },
  { name: "Beauty", icon: "💄", href: "/productView?category=beauty" },
  { name: "Sports", icon: "⚽", href: "/productView?category=sports" },
  { name: "Books", icon: "📚", href: "/productView?category=books" },
];

// Banner data
const banners = [
  {
    image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200&h=400&fit=crop",
    title: "Big Fashion Sale",
    subtitle: "Up to 70% Off on Top Brands",
    cta: "Shop Now",
    href: "/productView?category=fashion",
  },
  {
    image: "https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=1200&h=400&fit=crop",
    title: "Electronics Festival",
    subtitle: "Best Deals on Gadgets",
    cta: "Explore",
    href: "/productView?category=electronics",
  },
  {
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&h=400&fit=crop",
    title: "Home Makeover",
    subtitle: "Transform Your Space",
    cta: "Discover",
    href: "/productView?category=furniture",
  },
];

// Features data
const features = [
  { icon: "🚚", title: "Free Delivery", description: "On orders above ₹499" },
  { icon: "🔄", title: "Easy Returns", description: "10 days return policy" },
  { icon: "🔒", title: "Secure Payment", description: "100% secure checkout" },
  { icon: "🎧", title: "24/7 Support", description: "Dedicated support" },
];

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      console.log('🏠 Home: Fetching products...');
      const res = await fetch('http://localhost:5000/product/getall');
      if (res.ok) {
        const data = await res.json();
        console.log(`✅ Home: Got ${data.length} products`);
        if (data.length > 0) {
          console.log('📦 Sample product:', data[0]);
        } else {
          console.warn('⚠️ No products available in database');
        }
        setProducts(data);
      } else {
        console.error('❌ Home: Failed to fetch - Status:', res.status);
      }
    } catch (error) {
      console.error('❌ Home: Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface">
      <Navbar />
      
      {/* Hero Banner Carousel */}
      <section className="relative">
        <Swiper
          spaceBetween={0}
          centeredSlides={true}
          autoplay={{
            delay: 4000,
            disableOnInteraction: false,
          }}
          pagination={{
            clickable: true,
          }}
          navigation={true}
          modules={[Autoplay, Pagination, Navigation]}
          className="w-full h-[200px] sm:h-[300px] lg:h-[400px]"
        >
          {banners.map((banner, idx) => (
            <SwiperSlide key={idx}>
              <Link href={banner.href}>
                <div 
                  className="relative h-full bg-cover bg-center"
                  style={{ backgroundImage: `url('${banner.image}')` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
                  <div className="absolute inset-0 flex items-center">
                    <div className="section-container">
                      <div className="max-w-lg text-white">
                        <h2 className="text-2xl sm:text-4xl lg:text-5xl font-bold mb-2 sm:mb-4">{banner.title}</h2>
                        <p className="text-sm sm:text-lg lg:text-xl text-gray-200 mb-4 sm:mb-6">{banner.subtitle}</p>
                        <span className="btn-secondary inline-block">
                          {banner.cta} →
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      {/* Categories Section */}
      <section className="py-4 bg-white shadow-sm">
        <div className="section-container">
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
            {categories.map((category, idx) => (
              <CategoryCard key={idx} category={category} />
            ))}
          </div>
        </div>
      </section>

      {/* Features Bar */}
      <section className="py-4 bg-primary text-white">
        <div className="section-container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {features.map((feature, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <span className="text-2xl">{feature.icon}</span>
                <div>
                  <p className="font-medium text-sm">{feature.title}</p>
                  <p className="text-xs text-blue-200">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Deal of the Day */}
      <section className="py-6">
        <div className="section-container">
          <div className="bg-white rounded-sm p-4 shadow-card">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-bold text-gray-800">Deal of the Day</h2>
                <div className="hidden sm:flex items-center gap-1 text-sm">
                  <span className="bg-red-500 text-white px-2 py-1 rounded-sm font-mono">22</span>
                  <span className="text-gray-400">:</span>
                  <span className="bg-red-500 text-white px-2 py-1 rounded-sm font-mono">15</span>
                  <span className="text-gray-400">:</span>
                  <span className="bg-red-500 text-white px-2 py-1 rounded-sm font-mono">48</span>
                </div>
              </div>
              <Link href="/productView" className="text-primary text-sm font-medium hover:underline">
                View All →
              </Link>
            </div>
            
            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                {[...Array(5)].map((_, idx) => (
                  <div key={idx} className="animate-pulse">
                    <div className="aspect-square bg-gray-200 rounded-sm mb-3" />
                    <div className="h-4 bg-gray-200 rounded mb-2" />
                    <div className="h-4 bg-gray-200 rounded w-2/3" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                {products.slice(0, 5).map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Promotional Banners */}
      <section className="py-4">
        <div className="section-container">
          <div className="grid md:grid-cols-2 gap-4">
            <Link href="/productView?category=electronics">
              <div className="relative h-48 rounded-sm overflow-hidden group">
                <img 
                  src="https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=600&h=300&fit=crop"
                  alt="Electronics"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent flex items-center">
                  <div className="p-6 text-white">
                    <h3 className="text-2xl font-bold mb-2">Electronics Sale</h3>
                    <p className="text-gray-200 mb-3">Up to 50% off on top brands</p>
                    <span className="text-secondary font-medium">Shop Now →</span>
                  </div>
                </div>
              </div>
            </Link>
            
            <Link href="/productView?category=fashion">
              <div className="relative h-48 rounded-sm overflow-hidden group">
                <img 
                  src="https://images.unsplash.com/photo-1445205170230-053b83016050?w=600&h=300&fit=crop"
                  alt="Fashion"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent flex items-center">
                  <div className="p-6 text-white">
                    <h3 className="text-2xl font-bold mb-2">Fashion Week</h3>
                    <p className="text-gray-200 mb-3">New arrivals at best prices</p>
                    <span className="text-secondary font-medium">Explore →</span>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Trending Products */}
      <section className="py-6">
        <div className="section-container">
          <div className="bg-white rounded-sm p-4 shadow-card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800">Trending Now</h2>
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
            ) : products.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                {products.slice(0, 6).map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 mb-2">📦 No products available yet</p>
                <p className="text-sm text-gray-400">Sellers can add products to get started</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Shop by Category */}
      <section className="py-6">
        <div className="section-container">
          <div className="bg-white rounded-sm p-4 shadow-card">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Shop by Category</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
              {categories.map((category, idx) => (
                <Link key={idx} href={category.href}>
                  <div className="text-center group cursor-pointer">
                    <div className="w-20 h-20 mx-auto mb-2 rounded-full bg-surface flex items-center justify-center text-4xl group-hover:bg-primary/10 transition-colors">
                      {category.icon}
                    </div>
                    <p className="text-sm font-medium text-gray-700 group-hover:text-primary transition-colors">
                      {category.name}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="py-6">
        <div className="section-container">
          <div className="bg-white rounded-sm p-4 shadow-card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800">New Arrivals</h2>
              <Link href="/productView" className="text-primary text-sm font-medium hover:underline">
                View All →
              </Link>
            </div>
            
            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {[...Array(4)].map((_, idx) => (
                  <div key={idx} className="animate-pulse">
                    <div className="aspect-square bg-gray-200 rounded-sm mb-3" />
                    <div className="h-4 bg-gray-200 rounded mb-2" />
                    <div className="h-4 bg-gray-200 rounded w-2/3" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {products.slice(0, 4).map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-12 bg-primary">
        <div className="section-container">
          <div className="text-center text-white max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold mb-3">Subscribe & Save</h2>
            <p className="text-blue-200 mb-6">Get exclusive offers and updates delivered straight to your inbox</p>
            <form className="flex flex-col sm:flex-row gap-3 justify-center">
              <input
                type="email"
                placeholder="Enter your email address"
                className="px-4 py-3 rounded-sm text-gray-800 w-full sm:w-96 focus:outline-none focus:ring-2 focus:ring-secondary"
              />
              <button type="submit" className="btn-secondary whitespace-nowrap">
                Subscribe Now
              </button>
            </form>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;

