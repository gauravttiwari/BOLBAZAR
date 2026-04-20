"use client";
import { createContext, useContext, useEffect, useState, useCallback } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {

    const [cartOpen, setCartOpen] = useState(false);

  // Initialize cart items from localStorage only on client side
  const [cartItems, setCartItems] = useState([]);

  // Load cart items from localStorage after component mounts (client-side only)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const cartItemsinSession = localStorage.getItem("cartItems");
      console.log('🔄 Loading cart from localStorage...');
      if (cartItemsinSession) {
        try {
          const parsed = JSON.parse(cartItemsinSession);
          console.log(`✅ Loaded ${parsed.length} items from localStorage`);
          setCartItems(parsed);
        } catch (error) {
          console.error("❌ Error parsing cart items from localStorage:", error);
          setCartItems([]);
        }
      } else {
        console.log('ℹ️ No cart items in localStorage');
      }
    }
  }, []);

  // Save cart items to localStorage whenever they change
  useEffect(() => {
    if (typeof window !== 'undefined' && cartItems.length >= 0) {
      console.log(`💾 Saving ${cartItems.length} items to localStorage`);
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
    }
  }, [cartItems]);
  
  const addItemToCart = useCallback((item) => {
    console.log('➕ Adding item to cart:', item.pname || item.title);
    setCartItems(prevItems => {
      const exist = prevItems.find((cartItem) => cartItem._id === item._id);
      if (exist) {
        const updated = prevItems.map((cartItem) =>
          cartItem._id === item._id
            ? { ...exist, quantity: exist.quantity + 1 }
            : cartItem
        );
        console.log('✅ Updated quantity for:', item.pname);
        return updated;
      }
      console.log('✅ Added new item to cart. Total items:', prevItems.length + 1);
      return [...prevItems, { ...item, quantity: 1 }];
    });
  }, []);

  const removeItemFromCart = useCallback((item) => {
    setCartItems(prevItems => {
      const exist = prevItems.find((cartItem) => cartItem._id === item._id);
      if (!exist) return prevItems;
      
      if (exist.quantity === 1) {
        return prevItems.filter((cartItem) => cartItem._id !== item._id);
      } else {
        return prevItems.map((cartItem) =>
          cartItem._id === item._id
            ? { ...exist, quantity: exist.quantity - 1 }
            : cartItem
        );
      }
    });
  }, []);

  const clearCart = useCallback(() => {
    setCartItems([]);
    if (typeof window !== 'undefined') {
      localStorage.removeItem("cartItems");
    }
  }, []);

  const isInCart = useCallback((itemId) => {
    // Reduced logging - only on debug mode
    const found = cartItems.find((cartItem) => cartItem._id === itemId);
    if (process.env.NODE_ENV === 'development') {
      console.log('🔍 Checking isInCart for:', itemId, '→', found ? 'YES' : 'NO');
    }
    return found ? true : false;
  }, [cartItems]);

  const getCartTotal = useCallback(() => {
    return cartItems.reduce(
      (acc, item) => acc + item.pprice * item.quantity,
      0
    );
  }, [cartItems]);

  const getCartItemsCount = useCallback(() => {
    return cartItems.reduce((acc, item) => acc + item.quantity, 0);
  }, [cartItems]);

  

  return (
    <CartContext.Provider
      value={{
        cartOpen,
        setCartOpen,
        cartItems,
        setCartItems, // Exposed for manual refresh in checkout
        addItemToCart,
        removeItemFromCart,
        clearCart,
        isInCart,
        getCartTotal,
        getCartItemsCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

const useCartContext = () => useContext(CartContext);

export default useCartContext;
