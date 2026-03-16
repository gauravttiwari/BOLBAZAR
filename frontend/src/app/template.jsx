"use client";
import { SellerProvider } from "@/context/SellerContext";
import React from "react";

const Template = ({ children }) => {
  return (
    <SellerProvider>
      {children}
    </SellerProvider>
  );
};

export default Template;
