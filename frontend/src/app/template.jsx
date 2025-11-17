"use client";
import { AppProvider } from "@/context/AppContext";
import { CartProvider } from "@/context/CartContext";
import { SellerProvider } from "@/context/SellerContext";
import { VoiceProvider } from "@/context/VoiceContext";
import React from "react";

const Template = ({ children }) => {
  return (
    <VoiceProvider>
      <CartProvider>
        <SellerProvider>
          <AppProvider>
            {children}
          </AppProvider>
        </SellerProvider>
      </CartProvider>
    </VoiceProvider>
  );
};

export default Template;
