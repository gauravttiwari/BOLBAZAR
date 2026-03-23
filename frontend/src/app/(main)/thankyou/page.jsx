"use client";

import { IconCircleCheck } from "@tabler/icons-react";
import React, { useEffect, useRef, useState } from "react";
import Confetti from "react-confetti";
import useCartContext from "@/context/CartContext";
import useVoiceContext from "@/context/VoiceContext";
import { useRouter } from "next/navigation";


const ThankYou = () => {
  const [orderId, setOrderId] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const router = useRouter();
  const { finalTranscript, voiceResponse, resetTranscript } = useVoiceContext();

  // Voice command for managing/tracking order (English + Hindi)
  useEffect(() => {
    if (!finalTranscript) return;
    
    const lower = finalTranscript.toLowerCase();
    
    // Manage order / Track order voice commands (English + Hindi)
    if (
      lower.includes('manage order') ||
      lower.includes('manage my order') ||
      lower.includes('track order') ||
      lower.includes('track my order') ||
      lower.includes('order tracking') ||
      lower.includes('check order') ||
      lower.includes('check my order') ||
      lower.includes('ऑर्डर') ||
      lower.includes('ऑर्डर ट्रैक') ||
      lower.includes('ऑर्डर प्रबंधित') ||
      lower.includes('मेरा ऑर्डर') ||
      lower.includes('ऑर्डर की जांच')
    ) {
      voiceResponse('Opening your order details');
      router.push(`/user/ordertracking?orderId=OD${orderId}`);
      resetTranscript();
    }
    // Continue shopping / Home voice commands (English + Hindi)
    else if (
      lower.includes('continue shopping') ||
      lower.includes('shop more') ||
      lower.includes('home') ||
      lower.includes('homepage') ||
      lower.includes('खरीदारी जारी रखें') ||
      lower.includes('घर') ||
      lower.includes('होमपेज')
    ) {
      voiceResponse('Taking you back to shop');
      router.push('/');
      resetTranscript();
    }
  }, [finalTranscript, orderId, voiceResponse, resetTranscript, router]);

  useEffect(() => {
    // Dummy orderId and delivery date for demo; replace with real data if available
    const id = Math.floor(Math.random() * 1000000000000).toString();
    setOrderId(id);
    // Delivery date: 5 days from now
    const date = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000);
    setDeliveryDate(date.toLocaleDateString("en-IN", { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }));
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Confetti width={window.innerWidth} height={window.innerHeight} numberOfPieces={250} recycle={false} />
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full border-t-8 border-blue-600">
        <div className="flex items-center mb-4">
          <IconCircleCheck className="text-green-600" size={48} />
          <h2 className="ml-3 text-2xl font-bold text-blue-700">Order confirmed</h2>
        </div>
        <div className="mb-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Order placed</span>
            <span className="text-xs text-gray-400">Delivery</span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full my-2">
            <div className="h-2 bg-blue-500 rounded-full w-1/4"></div>
          </div>
        </div>
        <div className="mb-6">
          <p className="text-lg font-semibold mb-1">Hi Customer,</p>
          <p className="text-base font-medium text-gray-800 mb-2">Order successfully placed.</p>
          <p className="text-sm text-gray-600 mb-1">Your order will be delivered by <span className="font-semibold text-green-700">{deliveryDate}</span></p>
          <p className="text-sm text-gray-600 mb-1">Order No: <span className="font-mono text-blue-700">OD{orderId}</span></p>
          <p className="text-xs text-gray-400">Thank you for shopping with BolBazar!</p>
        </div>
        <button
          className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
          onClick={() => router.push(`/user/ordertracking?orderId=OD${orderId}`)}
        >
          Manage your order
        </button>
      </div>
    </div>
  );
};

export default ThankYou;
