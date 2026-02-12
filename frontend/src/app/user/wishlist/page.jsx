"use client";
import { useState, useEffect } from "react";
import useAppContext from "@/context/AppContext";
import useCartContext from "@/context/CartContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const Wishlist = () => {
  const router = useRouter();
  const { loggedIn, currentUser, loading: authLoading } = useAppContext();
  const { addItemToCart } = useCartContext();
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Wait for auth check to complete
    if (authLoading) return;
    
    if (!loggedIn) {
      router.push('/login');
      return;
    }
    // Fetch wishlist items from backend
    fetchWishlistItems();
  }, [loggedIn, authLoading, router]);

  const fetchWishlistItems = async () => {
    try {
      const res = await fetch(`${API_URL}/wishlist/user/${currentUser._id}`);
      if (res.ok) {
        const data = await res.json();
        setWishlistItems(data);
      }
    } catch (error) {
      console.error("Error fetching wishlist:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromWishlist = async (productId) => {
    try {
      const res = await fetch(`${API_URL}/wishlist/remove/${currentUser._id}/${productId}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setWishlistItems(wishlistItems.filter(item => item.productId !== productId));
        toast.success("Removed from wishlist");
      }
    } catch (error) {
      console.error("Error removing from wishlist:", error);
      toast.error("Failed to remove from wishlist");
    }
  };

  if (loading || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your wishlist...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface py-8">
      <div className="section-container">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Wishlist</h1>
          <p className="text-gray-600">Save your favorite items for later</p>
        </div>

        {wishlistItems.length === 0 ? (
          <div className="bg-white rounded-lg shadow-card p-12 text-center">
            <div className="text-6xl mb-4">❤️</div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">Your wishlist is empty</h2>
            <p className="text-gray-600 mb-6">Start adding products you love to your wishlist!</p>
            <Link
              href="/productView"
              className="inline-block bg-primary hover:bg-primary-dark text-white font-medium px-8 py-3 rounded-sm transition-colors"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlistItems.map((item) => (
              <div key={item._id} className="bg-white rounded-lg shadow-card hover:shadow-lg transition-shadow p-4">
                <Link href={`/productDetail/${item.productId}`}>
                  <div className="relative aspect-square mb-4 cursor-pointer">
                    <img
                      src={`http://localhost:5000/${item.image}`}
                      alt={item.pname}
                      className="w-full h-full object-cover rounded"
                      onError={(e) => {
                        e.target.src = '/placeholder-product.jpg';
                      }}
                    />
                  </div>
                </Link>
                <button 
                  onClick={() => handleRemoveFromWishlist(item.productId)}
                  className="absolute top-6 right-6 bg-white rounded-full p-2 shadow-md hover:bg-red-50 transition-colors"
                  title="Remove from wishlist"
                >
                  <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                  </svg>
                </button>
                <Link href={`/productDetail/${item.productId}`}>
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-primary cursor-pointer">{item.pname}</h3>
                </Link>
                {item.brand && <p className="text-sm text-gray-500 mb-2">{item.brand}</p>}
                <p className="text-primary font-bold text-lg mb-3">₹{item.price}</p>
                <button 
                  onClick={() => {
                    addItemToCart({ ...item, _id: item.productId, quantity: 1 });
                    toast.success("Added to cart!");
                  }}
                  className="w-full bg-secondary hover:bg-secondary-dark text-white font-medium py-2 rounded-sm transition-colors"
                >
                  Add to Cart
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
