"use client";
import React, { useEffect, useState, Fragment } from "react";
import { Dialog, Disclosure, Transition } from '@headlessui/react';
import { XMarkIcon, ChevronDownIcon, FunnelIcon, Squares2X2Icon, ListBulletIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useRouter, useSearchParams } from "next/navigation";
import useCartContext from "@/context/CartContext";
import useVoiceContext from "@/context/VoiceContext";
import ProductCard from "@/components/ProductCard";
import pluralize from "pluralize";

const sortOptions = [
  { name: 'Relevance', value: 'relevance' },
  { name: 'Price: Low to High', value: 'price-asc' },
  { name: 'Price: High to Low', value: 'price-desc' },
  { name: 'Newest First', value: 'newest' },
  { name: 'Rating', value: 'rating' },
];

const categories = [
  { name: 'All Products', value: '' },
  { name: 'Electronics', value: 'electronics' },
  { name: 'Fashion', value: 'fashion' },
  { name: 'Home & Furniture', value: 'furniture' },
  { name: 'Appliances', value: 'appliances' },
  { name: 'Beauty', value: 'beauty' },
  { name: 'Sports', value: 'sports' },
  { name: 'Books', value: 'books' },
];

const priceRanges = [
  { label: 'Under ₹500', min: 0, max: 500 },
  { label: '₹500 - ₹1000', min: 500, max: 1000 },
  { label: '₹1000 - ₹5000', min: 1000, max: 5000 },
  { label: '₹5000 - ₹10000', min: 5000, max: 10000 },
  { label: 'Above ₹10000', min: 10000, max: Infinity },
];

const ProductView = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [productList, setProductList] = useState([]);
  const [masterList, setMasterList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState('');
  const [currentSort, setCurrentSort] = useState('relevance');
  const [priceFilter, setPriceFilter] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [gridView, setGridView] = useState(true);

  const { addItemToCart, isInCart } = useCartContext();
  const { finalTranscript, voiceResponse, resetTranscript, triggerModal } = useVoiceContext();

  // Voice commands
  useEffect(() => {
    if (!finalTranscript) return;
    
    const transcript = finalTranscript.toLowerCase();
    
    if (transcript.includes('show me some ') || transcript.includes('search')) {
      const product = pluralize.singular(transcript.split(' ').pop());
      searchProduct(product);
      voiceResponse(`Here are some ${product}s for you`);
      resetTranscript();
    } else if (transcript.includes('filter by category')) {
      const category = transcript.split(' ').pop();
      filterByCategory(category);
      voiceResponse(`Filtering by ${category}`);
      resetTranscript();
    } else if (transcript.includes('clear search') || transcript.includes('clear filter')) {
      setProductList(masterList);
      setCurrentCategory('');
      setPriceFilter(null);
      resetTranscript();
    } else if (transcript.includes('add') && transcript.includes('cart')) {
      let productName = transcript.replace('add', '').replace('to cart', '').trim();
      const foundProduct = productList.find(p => 
        p.pname?.toLowerCase().includes(productName.toLowerCase())
      );
      if (foundProduct) {
        addItemToCart(foundProduct);
        voiceResponse(`Added ${foundProduct.pname} to cart`);
      }
      resetTranscript();
    }
  }, [finalTranscript]);

  // Fetch products
  useEffect(() => {
    fetchProducts();
  }, []);

  // Apply URL filters  
  useEffect(() => {
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    
    if (category) {
      setCurrentCategory(category);
      filterByCategory(category);
    }
    if (search) {
      setSearchTerm(search);
      searchProduct(search);
    }
  }, [searchParams, masterList]);

  const fetchProducts = async () => {
    try {
      console.log('🔄 Fetching all products...');
      const res = await fetch('http://localhost:5000/product/getall');
      if (res.ok) {
        const data = await res.json();
        console.log('✅ Products fetched:', data.length, 'products');
        console.log('📦 Product data:', data);
        setMasterList(data);
        setProductList(data);
      } else {
        console.error('❌ Failed to fetch products - Status:', res.status);
      }
    } catch (error) {
      console.error('❌ Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterByCategory = (category) => {
    if (!category) {
      setProductList(masterList);
      setCurrentCategory('');
      return;
    }
    const filtered = masterList.filter(p => 
      p.category?.toLowerCase().includes(category.toLowerCase()) ||
      p.pname?.toLowerCase().includes(category.toLowerCase())
    );
    setProductList(filtered);
    setCurrentCategory(category);
  };

  const filterByPrice = (range) => {
    setPriceFilter(range);
    let filtered = masterList;
    if (currentCategory) {
      filtered = filtered.filter(p => 
        p.category?.toLowerCase().includes(currentCategory.toLowerCase())
      );
    }
    if (range) {
      filtered = filtered.filter(p => p.pprice >= range.min && p.pprice <= range.max);
    }
    setProductList(filtered);
  };

  const searchProduct = (query) => {
    if (!query) {
      setProductList(masterList);
      return;
    }
    const filtered = masterList.filter(p => 
      p.pname?.toLowerCase().includes(query.toLowerCase()) ||
      p.pdetail?.toLowerCase().includes(query.toLowerCase()) ||
      p.category?.toLowerCase().includes(query.toLowerCase())
    );
    setProductList(filtered);
  };

  const sortProducts = (sortValue) => {
    setCurrentSort(sortValue);
    let sorted = [...productList];
    switch (sortValue) {
      case 'price-asc':
        sorted.sort((a, b) => a.pprice - b.pprice);
        break;
      case 'price-desc':
        sorted.sort((a, b) => b.pprice - a.pprice);
        break;
      case 'newest':
        sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'rating':
        sorted.sort((a, b) => (b.rating || 4) - (a.rating || 4));
        break;
      default:
        break;
    }
    setProductList(sorted);
  };

  const clearAllFilters = () => {
    setCurrentCategory('');
    setPriceFilter(null);
    setSearchTerm('');
    setProductList(masterList);
    router.push('/productView');
  };

  // Filter Sidebar Component
  const FilterSidebar = ({ mobile = false }) => (
    <div className={mobile ? 'px-4' : ''}>
      {/* Categories */}
      <div className="border-b border-gray-200 py-4">
        <h3 className="font-semibold text-gray-900 mb-3">Categories</h3>
        <div className="space-y-2">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => filterByCategory(cat.value)}
              className={`block w-full text-left px-3 py-2 rounded-sm text-sm transition-colors ${
                currentCategory === cat.value
                  ? 'bg-primary text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Price Filter */}
      <div className="border-b border-gray-200 py-4">
        <h3 className="font-semibold text-gray-900 mb-3">Price</h3>
        <div className="space-y-2">
          {priceRanges.map((range, idx) => (
            <button
              key={idx}
              onClick={() => filterByPrice(range)}
              className={`block w-full text-left px-3 py-2 rounded-sm text-sm transition-colors ${
                priceFilter?.label === range.label
                  ? 'bg-primary text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      {/* Clear Filters */}
      {(currentCategory || priceFilter) && (
        <button
          onClick={clearAllFilters}
          className="mt-4 w-full py-2 border border-primary text-primary rounded-sm text-sm font-medium hover:bg-primary hover:text-white transition-colors"
        >
          Clear All Filters
        </button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-surface">
      {/* Mobile filter dialog */}
      <Transition.Root show={mobileFiltersOpen} as={Fragment}>
        <Dialog as="div" className="relative z-40 lg:hidden" onClose={setMobileFiltersOpen}>
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 z-40 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="translate-x-full"
            >
              <Dialog.Panel className="relative ml-auto flex h-full w-full max-w-xs flex-col overflow-y-auto bg-white py-4 pb-12 shadow-xl">
                <div className="flex items-center justify-between px-4 border-b border-gray-200 pb-4">
                  <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
                  <button
                    type="button"
                    className="p-2 text-gray-400 hover:text-gray-500"
                    onClick={() => setMobileFiltersOpen(false)}
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>
                <FilterSidebar mobile />
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      <div className="section-container py-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {currentCategory ? `${currentCategory.charAt(0).toUpperCase() + currentCategory.slice(1)}` : 'All Products'}
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              {productList.length} products found
              {searchTerm && ` for "${searchTerm}"`}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Sort Dropdown */}
            <select
              value={currentSort}
              onChange={(e) => sortProducts(e.target.value)}
              className="bg-white border border-gray-200 rounded-sm px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  Sort by: {option.name}
                </option>
              ))}
            </select>

            {/* View Toggle */}
            <div className="hidden sm:flex items-center border border-gray-200 rounded-sm overflow-hidden">
              <button
                onClick={() => setGridView(true)}
                className={`p-2 ${gridView ? 'bg-primary text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
              >
                <Squares2X2Icon className="h-5 w-5" />
              </button>
              <button
                onClick={() => setGridView(false)}
                className={`p-2 ${!gridView ? 'bg-primary text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
              >
                <ListBulletIcon className="h-5 w-5" />
              </button>
            </div>

            {/* Mobile Filter Button */}
            <button
              onClick={() => setMobileFiltersOpen(true)}
              className="lg:hidden flex items-center gap-2 border border-gray-200 bg-white px-3 py-2 rounded-sm text-sm"
            >
              <FunnelIcon className="h-5 w-5" />
              Filters
            </button>
          </div>
        </div>

        {/* Active Filters */}
        {(currentCategory || priceFilter) && (
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="text-sm text-gray-500">Active filters:</span>
            {currentCategory && (
              <span className="inline-flex items-center gap-1 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                {currentCategory}
                <button onClick={() => filterByCategory('')} className="hover:bg-primary/20 rounded-full p-0.5">
                  <XMarkIcon className="h-4 w-4" />
                </button>
              </span>
            )}
            {priceFilter && (
              <span className="inline-flex items-center gap-1 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                {priceFilter.label}
                <button onClick={() => filterByPrice(null)} className="hover:bg-primary/20 rounded-full p-0.5">
                  <XMarkIcon className="h-4 w-4" />
                </button>
              </span>
            )}
          </div>
        )}

        <div className="flex gap-6">
          {/* Sidebar - Desktop */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="bg-white rounded-sm shadow-card p-4 sticky top-20">
              <h2 className="font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">Filters</h2>
              <FilterSidebar />
            </div>
          </aside>

          {/* Product Grid */}
          <main className="flex-1">
            {loading ? (
              <div className={`grid ${gridView ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4' : 'grid-cols-1'} gap-4`}>
                {[...Array(8)].map((_, idx) => (
                  <div key={idx} className="bg-white rounded-sm p-4 animate-pulse">
                    <div className="aspect-square bg-gray-200 rounded-sm mb-3" />
                    <div className="h-4 bg-gray-200 rounded mb-2" />
                    <div className="h-4 bg-gray-200 rounded w-2/3" />
                  </div>
                ))}
              </div>
            ) : productList.length > 0 ? (
              <div className={`grid ${gridView ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4' : 'grid-cols-1'} gap-4`}>
                {productList.map((product) => (
                  gridView ? (
                    <ProductCard key={product._id} product={product} />
                  ) : (
                    // List View
                    <Link key={product._id} href={`/productDetail/${product._id}`}>
                      <div className="bg-white rounded-sm shadow-card p-4 flex gap-4 hover:shadow-card-hover transition-shadow">
                        <img
                          src={
                            product.images && product.images.length > 0
                              ? `http://localhost:5000/${product.images[0]}`
                              : 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect fill="%23f0f0f0" width="200" height="200"/%3E%3Ctext fill="%23999" font-family="Arial" font-size="14" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3ENo Image%3C/text%3E%3C/svg%3E'
                          }
                          alt={product.pname}
                          className="w-32 h-32 object-contain flex-shrink-0"
                          onError={(e) => {
                            e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect fill="%23f0f0f0" width="200" height="200"/%3E%3Ctext fill="%23999" font-family="Arial" font-size="14" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3ENo Image%3C/text%3E%3C/svg%3E';
                          }}
                        />
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-800 mb-1">{product.pname}</h3>
                          <p className="text-sm text-gray-500 line-clamp-2 mb-2">{product.pdetail}</p>
                          <div className="flex items-center gap-1 mb-2">
                            <span className="rating-badge">
                              {(product.rating || 4.2).toFixed(1)}
                              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-lg font-semibold text-gray-900">₹{product.pprice?.toLocaleString()}</span>
                            <span className="text-xs text-gray-500">Free Delivery</span>
                          </div>
                          {product.seller && (
                            <p className="text-xs text-gray-400 mt-1">
                              Sold by: {product.seller.fname} {product.seller.lname}
                            </p>
                          )}
                        </div>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            addItemToCart(product);
                          }}
                          disabled={isInCart && isInCart(product._id)}
                          className={`self-center px-4 py-2 rounded-sm text-sm font-medium transition-colors ${
                            isInCart && isInCart(product._id)
                              ? 'bg-gray-200 text-gray-500'
                              : 'bg-secondary hover:bg-secondary-dark text-white'
                          }`}
                        >
                          {isInCart && isInCart(product._id) ? 'Added' : 'Add to Cart'}
                        </button>
                      </div>
                    </Link>
                  )
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-sm shadow-card py-16 text-center">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">No Products Found</h3>
                <p className="text-gray-500 mb-4">Try adjusting your filters or search terms</p>
                <button onClick={clearAllFilters} className="btn-primary">
                  Clear Filters
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default ProductView;

