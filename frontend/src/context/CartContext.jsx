"use client";
import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {

    const [cartOpen, setCartOpen] = useState(false);

  // Initialize cart items from localStorage only on client side
  const [cartItems, setCartItems] = useState([]);

  // Load cart items from localStorage after component mounts (client-side only)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const cartItemsinSession = localStorage.getItem("cartItems");
      if (cartItemsinSession) {
        try {
          setCartItems(JSON.parse(cartItemsinSession));
        } catch (error) {
          console.error("Error parsing cart items from localStorage:", error);
          setCartItems([]);
        }
      }
    }
  }, []);

  // Save cart items to localStorage whenever they change
  useEffect(() => {
    if (typeof window !== 'undefined' && cartItems.length >= 0) {
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
    }
  }, [cartItems]);
  const addItemToCart = (item) => {
    const exist = cartItems.find((cartItem) => cartItem._id === item._id);
    if (exist) {
      setCartItems(
        cartItems.map((cartItem) =>
          cartItem._id === item._id
            ? { ...exist, quantity: exist.quantity + 1 }
            : cartItem
        )
      );
      return;
    }
    setCartItems([...cartItems, { ...item, quantity: 1 }]);
  };
  const removeItemFromCart = (item) => {
    const exist = cartItems.find((cartItem) => cartItem._id === item._id);
    if (exist.quantity === 1) {
      setCartItems(cartItems.filter((cartItem) => cartItem._id !== item._id));
    } else {
      setCartItems(
        cartItems.map((cartItem) =>
          cartItem._id === item._id
            ? { ...exist, quantity: exist.quantity - 1 }
            : cartItem
        )
      );
    }
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const isInCart = (item) => {
    return cartItems.find((cartItem) => cartItem._id === item._id);
  };

  const getCartTotal = () => {
    return cartItems.reduce(
      (acc, item) => acc + item.pprice * item.quantity,
      0
    );
  };
  const getCartItemsCount = () => {
    return cartItems.reduce((acc, item) => acc + item.quantity, 0);
  };

  

  return (
    <CartContext.Provider
      value={{
        cartOpen,
        setCartOpen,
        cartItems,
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
