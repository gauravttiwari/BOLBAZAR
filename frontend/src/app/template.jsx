"use client";
import { AppProvider } from "@/context/AppContext";
import { SellerProvider } from "@/context/SellerContext";
import { VoiceProvider } from "@/context/VoiceContext";
import React from "react";

const Template = ({ children }) => {
  return (
    <VoiceProvider>
      <SellerProvider>
        <AppProvider>
          {children}
        </AppProvider>
      </SellerProvider>
    </VoiceProvider>
  );
};

export default Template;
