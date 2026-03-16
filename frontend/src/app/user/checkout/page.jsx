"use client";
import React, { useEffect, useState } from "react";
import useVoiceContext from "@/context/VoiceContext";
import useCartContext from "@/context/CartContext";
import useAppContext from "@/context/AppContext";
import { useRouter } from "next/navigation";
import { IconMapPin, IconTruck, IconCreditCard, IconCheck, IconPlus, IconEdit, IconTrash } from "@tabler/icons-react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from '@stripe/react-stripe-js';
import PaymentGateway from "./PaymentGateway";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY);

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const appearance = {
  theme: "day",
};

const CheckOut = () => {
  const { finalTranscript, resetTranscript, voiceResponse } = useVoiceContext();
  const [currentStep, setCurrentStep] = useState(1);
  const router = useRouter();
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const { cartItems, setCartItems, getCartTotal: contextGetTotal, clearCart } = useCartContext();
  // Voice command for placing order (English + Hindi)
  // Voice command for placing order (English + Hindi)
  React.useEffect(() => {
    if (currentStep === 4 && finalTranscript) {
      const lower = finalTranscript.toLowerCase();
      if (
        lower.includes('place order') ||
        lower.includes('order now') ||
        lower.includes('confirm order') ||
        lower.includes('complete order') ||
        lower.includes('ऑर्डर करो') ||
        lower.includes('ऑर्डर कर दो') ||
        lower.includes('ऑर्डर प्लेस करो') ||
        lower.includes('ऑर्डर')
      ) {
        voiceResponse('Placing your order');
        placeOrder();
        resetTranscript();
      }
    }
  }, [finalTranscript, currentStep, resetTranscript, voiceResponse]);
    // Voice input for address form fields (Hindi + English)
    React.useEffect(() => {
      if (currentStep === 1 && showAddressForm && finalTranscript) {
        const lower = finalTranscript.toLowerCase();
        // Name
        if (lower.startsWith('name:') || lower.startsWith('नाम:')) {
          const value = lower.split(':')[1]?.trim();
          if (value) setNewAddress(prev => ({ ...prev, name: value }));
          voiceResponse('Name set');
          resetTranscript();
        }
        // Mobile
        if (lower.startsWith('mobile:') || lower.startsWith('मोबाइल:')) {
          const value = lower.split(':')[1]?.replace(/\D/g, '').trim();
          if (value) setNewAddress(prev => ({ ...prev, mobile: value }));
          voiceResponse('Mobile set');
          resetTranscript();
        }
        // Pincode
        if (lower.startsWith('pincode:') || lower.startsWith('पिनकोड:')) {
          const value = lower.split(':')[1]?.replace(/\D/g, '').trim();
          if (value) setNewAddress(prev => ({ ...prev, pincode: value }));
          voiceResponse('Pincode set');
          resetTranscript();
        }
        // State
        if (lower.startsWith('state:') || lower.startsWith('राज्य:')) {
          const value = lower.split(':')[1]?.trim();
          if (value) setNewAddress(prev => ({ ...prev, state: value }));
          voiceResponse('State set');
          resetTranscript();
        }
        // City
        if (lower.startsWith('city:') || lower.startsWith('शहर:')) {
          const value = lower.split(':')[1]?.trim();
          if (value) setNewAddress(prev => ({ ...prev, city: value }));
          voiceResponse('City set');
          resetTranscript();
        }
        // Address
        if (lower.startsWith('address:') || lower.startsWith('पता:')) {
          const value = lower.split(':')[1]?.trim();
          if (value) setNewAddress(prev => ({ ...prev, address: value }));
          voiceResponse('Address set');
          resetTranscript();
        }
        // Locality
        if (lower.startsWith('locality:') || lower.startsWith('इलाका:')) {
          const value = lower.split(':')[1]?.trim();
          if (value) setNewAddress(prev => ({ ...prev, locality: value }));
          voiceResponse('Locality set');
          resetTranscript();
        }
        // Landmark
        if (lower.startsWith('landmark:') || lower.startsWith('सीमाचिह्न:')) {
          const value = lower.split(':')[1]?.trim();
          if (value) setNewAddress(prev => ({ ...prev, landmark: value }));
          voiceResponse('Landmark set');
          resetTranscript();
        }
        // Address Type
        if (lower.includes('address type home') || lower.includes('पता प्रकार घर')) {
          setNewAddress(prev => ({ ...prev, addressType: 'home' }));
          voiceResponse('Address type set to home');
          resetTranscript();
        }
        if (lower.includes('address type work') || lower.includes('पता प्रकार कार्य')) {
          setNewAddress(prev => ({ ...prev, addressType: 'work' }));
          voiceResponse('Address type set to work');
          resetTranscript();
        }
        if (lower.includes('address type other') || lower.includes('पता प्रकार अन्य')) {
          setNewAddress(prev => ({ ...prev, addressType: 'other' }));
          voiceResponse('Address type set to other');
          resetTranscript();
        }
      }
    }, [finalTranscript, currentStep, showAddressForm, setNewAddress, voiceResponse, resetTranscript]);
  // Voice command for selecting Cash on Delivery (COD)
  React.useEffect(() => {
    if (currentStep === 3 && finalTranscript) {
      const lower = finalTranscript.toLowerCase();
      // English and Hindi commands for COD
      if (
        lower.includes("cash on delivery") ||
        lower.includes("cod") ||
        lower.includes("nakad") ||
        lower.includes("nakad par") ||
        lower.includes("nakad par dijiye") ||
        lower.includes("nakad chuno") ||
        lower.includes("cash par dijiye") ||
        lower.includes("cash select") ||
        lower.includes("cod select") ||
        lower.includes("cod chuno")
      ) {
        setPaymentMethod('cod');
        voiceResponse('Cash on Delivery selected');
        resetTranscript();
      }
    }
  }, [finalTranscript, currentStep, setPaymentMethod, resetTranscript, voiceResponse]);

  // Voice command: place order/pay now
  useEffect(() => {
    const listener = () => {
      // Only allow placing order on confirmation step
      if (currentStep === 4) {
        // Find the confirm/submit button and click it, or trigger your order placement logic here
        // For demonstration, just show a voice response
        voiceResponse && voiceResponse("Order placed successfully.");
        // You should call your actual order placement logic here if needed
      } else {
        // Move to confirmation step if not already there
        setCurrentStep(4);
        voiceResponse && voiceResponse("Moved to order confirmation. Say 'place order' again to confirm.");
      }
    };
    window.addEventListener("voicePlaceOrder", listener);
    return () => window.removeEventListener("voicePlaceOrder", listener);
  }, [currentStep, voiceResponse]);

  // Debug: Log cartItems on every render
  console.log('[DEBUG] cartItems (context):', cartItems);

  // Debug: Log localStorage cartItems on every render (client only)
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem('cartItems');
      console.log('[DEBUG] cartItems (localStorage):', stored ? JSON.parse(stored) : 'null');
    } catch (e) {
      console.log('[DEBUG] Error reading cartItems from localStorage:', e);
    }
  }

    // Ensure cart is restored from localStorage if context is empty
    // Always sync cart from localStorage on mount and when page is shown (handles browser navigation)
    useEffect(() => {
      const syncCart = () => {
        if (typeof window !== 'undefined') {
          const stored = localStorage.getItem('cartItems');
          if (stored) {
            try {
              const parsed = JSON.parse(stored);
              setCartItems(parsed);
              console.log('[DEBUG] useEffect syncCart: setCartItems(parsed)', parsed);
            } catch (e) {
              console.log('[DEBUG] Error parsing cartItems in syncCart:', e);
            }
          } else {
            console.log('[DEBUG] useEffect syncCart: No cartItems in localStorage');
          }
        }
      };
      syncCart();
      window.addEventListener('pageshow', syncCart);
      return () => window.removeEventListener('pageshow', syncCart);
    }, [setCartItems]);
  const { currentUser, loggedIn, loading: authLoading } = useAppContext();
  
  // State management
  // const [currentStep, setCurrentStep] = useState(1); // Duplicate removed
  const [loading, setLoading] = useState(true);

  
  // Address state
  const [newAddress, setNewAddress] = useState({
    name: '',
    mobile: '',
    pincode: '',
    state: '',
    city: '',
    address: '',
    landmark: '',
    addressType: 'home'
  });
  const [pincodeVerification, setPincodeVerification] = useState(null);
  
  // Delivery state
  const [deliveryOption, setDeliveryOption] = useState('normal');
  const [deliveryCharge, setDeliveryCharge] = useState(0);
  const [estimatedDeliveryDays, setEstimatedDeliveryDays] = useState(5);
  
  // Payment state
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [clientSecret, setClientSecret] = useState("");
  const [processingPayment, setProcessingPayment] = useState(false);

  // Steps for checkout wizard
  const steps = [
    { num: 1, label: 'Address', icon: <IconMapPin size={24} /> },
    { num: 2, label: 'Delivery', icon: <IconTruck size={24} /> },
    { num: 3, label: 'Payment', icon: <IconCreditCard size={24} /> },
    { num: 4, label: 'Confirm', icon: <IconCheck size={24} /> }
  ];

  // Helper function to get cart total
  const getCartTotal = () => {
    return cartItems.reduce((acc, item) => 
      acc + ((item.pprice || item.price || 0) * (item.quantity || 1)), 0
    );
  };

  // Check authentication and load addresses
  useEffect(() => {
    const initializeCheckout = async () => {
      // Wait for auth context to load
      if (authLoading) {
        return;
      }

      // If not logged in, redirect to login
      if (!loggedIn || !currentUser) {
        sessionStorage.setItem('redirectAfterLogin', '/user/checkout');
        router.push('/login');
        return;
      }

      // User is logged in, load addresses
      if (currentUser?._id) {
        await loadAddresses(currentUser._id);
      }
      
      setLoading(false);
    };

    initializeCheckout();
  }, [authLoading, loggedIn, currentUser, router]);

  // Load addresses
  const loadAddresses = async (userId) => {
    try {
      const response = await fetch(`${API_URL}/user/address/getall/${userId}`);
      if (response.ok) {
        const data = await response.json();
        setAddresses(data);
        const defaultAddr = data.find(addr => addr.isDefault);
        if (defaultAddr) {
          setSelectedAddress(defaultAddr);
        }
      }
    } catch (error) {
      console.error("Error loading addresses:", error);
      voiceResponse('Failed to load addresses');
    }
  };

  // Verify pincode
  const verifyPincode = async (pincode) => {
    try {
      const response = await fetch(`${API_URL}/user/verify-pincode/${pincode}`);
      if (response.ok) {
        const data = await response.json();
        setPincodeVerification(data);
        if (data.deliverable) {
          setEstimatedDeliveryDays(data.estimatedDays);
        }
        return data;
      }
    } catch (error) {
      console.error("Error verifying pincode:", error);
      voiceResponse('Failed to verify pincode');
    }
    return null;
  };

  // Handle address input change
  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setNewAddress(prev => ({ ...prev, [name]: value }));
    
    // Auto-verify pincode when it's 6 digits
    if (name === 'pincode' && value.length === 6) {
      verifyPincode(value);
    }
  };

  // Add new address
  const handleAddAddress = async () => {
    if (!currentUser) return;
    
    try {
      const response = await fetch(`${API_URL}/user/address/add/${currentUser._id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAddress)
      });
      
      if (response.ok) {
        const data = await response.json();
        setAddresses(data.addresses);
        const addedAddress = data.addresses[data.addresses.length - 1];
        setSelectedAddress(addedAddress);
        setShowAddressForm(false);
        setNewAddress({
          name: '',
          mobile: '',
          pincode: '',
          state: '',
          city: '',
          address: '',
          locality: '',
          landmark: '',
          addressType: 'home'
        });
        voiceResponse('Address added successfully');
      }
    } catch (error) {
      console.error("Error adding address:", error);
      voiceResponse('Failed to add address');
      alert("Failed to add address. Please try again.");
    }
  };

  // Delete address
  const handleDeleteAddress = async (addressId) => {
    if (!currentUser) return;
    
    try {
      const response = await fetch(`${API_URL}/user/address/delete/${currentUser._id}/${addressId}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        const data = await response.json();
        setAddresses(data.addresses);
        if (selectedAddress?._id === addressId) {
          setSelectedAddress(data.addresses[0] || null);
        }
        voiceResponse('Address deleted');
      }
    } catch (error) {
      console.error("Error deleting address:", error);
      voiceResponse('Failed to delete address');
    }
  };

  // Handle delivery option change
  const handleDeliveryChange = (option) => {
    setDeliveryOption(option);
    if (option === 'fast') {
      setDeliveryCharge(50);
      setEstimatedDeliveryDays(2);
    } else {
      setDeliveryCharge(0);
      setEstimatedDeliveryDays(5);
    }
  };

  // Get payment intent for online payment
  const getPaymentIntent = async () => {
    if (!currentUser || !selectedAddress) {
      alert('Please complete all required steps');
      return null;
    }

    const totalAmount = getCartTotal() + deliveryCharge;
    
    if (totalAmount <= 0) {
      alert('Cart is empty. Please add items to cart before checkout.');
      router.push('/');
      return null;
    }
    
    console.log('Creating payment intent for amount:', totalAmount);
    
    try {
      const res = await fetch(`${API_URL}/create-payment-intent`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: totalAmount,
          customerData: {
            name: selectedAddress.name,
            email: currentUser.email,
            address: {
              line1: selectedAddress.address,
              city: selectedAddress.city,
              state: selectedAddress.state,
              postal_code: selectedAddress.pincode,
              country: "IN",
            },
          },
        }),
      });
      
      if (!res.ok) {
        throw new Error(`Payment intent creation failed: ${res.status}`);
      }
      
      const data = await res.json();
      console.log('Payment intent created successfully');
      setClientSecret(data.clientSecret);
      return data.clientSecret;
    } catch (error) {
      console.error("Error creating payment intent:", error);
      alert("Failed to initialize payment. Please try again or choose Cash on Delivery.");
      return null;
    }
  };

  // Place order
  const placeOrder = async () => {
    if (!currentUser || !selectedAddress) {
      voiceResponse('Please complete all required steps');
      alert('Please complete all required steps');
      return;
    }

    console.log('🛒 Placing order with', cartItems.length, 'items');
    console.log('📦 Items:', cartItems);

    if (!cartItems || cartItems.length === 0) {
      voiceResponse('Your cart is empty. Please add items before placing order.');
      alert('Your cart is empty. Please add items before placing order.');
      router.push('/');
      return;
    }

    setProcessingPayment(true);
    console.log('Placing order with items:', cartItems);

    try {
      const subtotal = getCartTotal();
      const totalAmount = subtotal + deliveryCharge;
      console.log('Order subtotal:', subtotal);
      console.log('Order total amount:', totalAmount);
      
      const estimatedDate = new Date();
      estimatedDate.setDate(estimatedDate.getDate() + estimatedDeliveryDays);

      const orderData = {
        user: currentUser._id,
        items: cartItems,
        shippingAddress: selectedAddress,
        deliveryOption,
        deliveryCharge,
        estimatedDeliveryDate: estimatedDate,
        paymentMethod,
        paymentDetails: { amount: totalAmount },
        mode: paymentMethod === 'cod' ? 'cash' : 'online',
        intentId: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
        subtotal: subtotal,
        totalAmount,
        status: 'placed',
        statusHistory: [{
          status: 'placed',
          timestamp: new Date(),
          note: 'Order placed successfully'
        }],
        tracking: [{
          status: 'placed',
          message: 'Order placed successfully',
          timestamp: new Date()
        }]
      };

      const response = await fetch(`${API_URL}/order/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });

      console.log('Order response status:', response.status);

      if (response.ok) {
        const order = await response.json();
        console.log('Order placed successfully:', order._id);
        voiceResponse('Order placed successfully');
        // Notify seller
        try {
          await fetch(`${API_URL}/order/notify-seller/${order._id}`, {
            method: 'PUT'
          });
        } catch (err) {
          console.log('Seller notification failed (non-critical):', err);
        }

        clearCart();
        router.push(`/thankyou`);
      } else {
        const errorText = await response.text();
        console.error('Order placement failed:', errorText);
        voiceResponse('Failed to place order');
        throw new Error(`Failed to place order: ${errorText}`);
      }
    } catch (error) {
      console.error("Error placing order:", error);
      voiceResponse('Failed to place order');
      alert("Failed to place order. Please try again.");
    } finally {
      setProcessingPayment(false);
    }
  };

  // Handle online payment
  const handleOnlinePayment = async () => {
    console.log('Initiating online payment...');
    setProcessingPayment(true);
    
    try {
      const secret = await getPaymentIntent();
      if (secret) {
        console.log('Payment intent received, moving to payment step');
        setCurrentStep(4);
      } else {
        console.error('Failed to get payment intent');
        alert('Unable to initialize payment. Please try again or use Cash on Delivery.');
      }
    } catch (error) {
      console.error('Online payment error:', error);
      alert('Payment initialization failed. Please try Cash on Delivery.');
    } finally {
      setProcessingPayment(false);
    }
  };

  // Step validation
  const canProceedToStep = (step) => {
    switch (step) {
      case 2:
        return selectedAddress !== null;
      case 3:
        return selectedAddress !== null && deliveryOption !== null;
      case 4:
        return selectedAddress !== null && deliveryOption !== null && paymentMethod !== null;
      default:
        return true;
    }
  };

  if (loading || authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">
            Loading...
          </p>
        </div>
      </div>
    );
  }

  if (!currentUser || !loggedIn) {
    return null; // Will redirect to login
  }

  return (
    <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            {steps.map((step, index) => (
              <React.Fragment key={step.num}>
                <div className="flex flex-col items-center">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    currentStep >= step.num 
                      ? 'bg-emerald-600 text-white' 
                      : 'bg-gray-300 text-gray-600'
                  }`}>
                    {currentStep > step.num ? <IconCheck size={24} /> : step.icon}
                  </div>
                  <span className={`mt-2 text-sm font-medium ${
                    currentStep >= step.num ? 'text-emerald-600' : 'text-gray-500'
                  }`}>
                    {step.label}
                  </span>
                </div>
                {index < 3 && (
                  <div className={`flex-1 h-1 mx-4 ${
                    currentStep > step.num ? 'bg-emerald-600' : 'bg-gray-300'
                  }`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              
              {/* Step 1: Address Selection */}
              {currentStep === 1 && (
                <div>
                  <h2 className="text-2xl font-bold mb-6">Select Delivery Address</h2>
                  
                  {/* Saved Addresses */}
                  <div className="space-y-4 mb-6">
                    {addresses.map((addr) => (
                      <div
                        key={addr._id}
                        onClick={() => setSelectedAddress(addr)}
                        className={`border rounded-lg p-4 cursor-pointer transition-all ${
                          selectedAddress?._id === addr._id
                            ? 'border-emerald-500 bg-emerald-50'
                            : 'border-gray-200 hover:border-emerald-300'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="font-semibold">{addr.name}</span>
                              <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">
                                {addr.addressType}
                              </span>
                              {addr.isDefault && (
                                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs rounded">
                                  Default
                                </span>
                              )}
                            </div>
                            <p className="text-gray-700">{addr.address}</p>
                            {addr.locality && <p className="text-gray-600">{addr.locality}</p>}
                            <p className="text-gray-600">
                              {addr.city}, {addr.state} - {addr.pincode}
                            </p>
                            <p className="text-gray-600 mt-1">Mobile: {addr.mobile}</p>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteAddress(addr._id);
                            }}
                            className="text-red-500 hover:text-red-700"
                          >
                            <IconTrash size={20} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Add New Address Button */}
                  {!showAddressForm && (
                    <button
                      onClick={() => setShowAddressForm(true)}
                      className="w-full border-2 border-dashed border-gray-300 rounded-lg p-4 text-emerald-600 hover:border-emerald-500 hover:bg-emerald-50 transition-all flex items-center justify-center gap-2"
                    >
                      <IconPlus size={20} />
                      Add New Address
                    </button>
                  )}

                  {/* New Address Form */}
                  {showAddressForm && (
                    <div className="border border-gray-200 rounded-lg p-6 mt-4">
                      <h3 className="font-semibold mb-4">Add New Address</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <input
                          type="text"
                          name="name"
                          placeholder="Full Name *"
                          value={newAddress.name}
                          onChange={handleAddressChange}
                          className="col-span-2 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                        <input
                          type="text"
                          name="mobile"
                          placeholder="Mobile Number *"
                          value={newAddress.mobile}
                          onChange={handleAddressChange}
                          className="col-span-2 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                        <input
                          type="text"
                          name="pincode"
                          placeholder="Pincode *"
                          value={newAddress.pincode}
                          onChange={handleAddressChange}
                          className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                        <input
                          type="text"
                          name="state"
                          placeholder="State *"
                          value={newAddress.state}
                          onChange={handleAddressChange}
                          className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                        <input
                          type="text"
                          name="city"
                          placeholder="City *"
                          value={newAddress.city}
                          onChange={handleAddressChange}
                          className="col-span-2 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                        <input
                          type="text"
                          name="address"
                          placeholder="Address (House No, Building, Street) *"
                          value={newAddress.address}
                          onChange={handleAddressChange}
                          className="col-span-2 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                        <input
                          type="text"
                          name="locality"
                          placeholder="Locality/Area"
                          value={newAddress.locality}
                          onChange={handleAddressChange}
                          className="col-span-2 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                        <input
                          type="text"
                          name="landmark"
                          placeholder="Landmark (Optional)"
                          value={newAddress.landmark}
                          onChange={handleAddressChange}
                          className="col-span-2 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                        <div className="col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Address Type
                          </label>
                          <div className="flex gap-4">
                            {['home', 'work', 'other'].map((type) => (
                              <label key={type} className="flex items-center">
                                <input
                                  type="radio"
                                  name="addressType"
                                  value={type}
                                  checked={newAddress.addressType === type}
                                  onChange={handleAddressChange}
                                  className="mr-2"
                                />
                                <span className="capitalize">{type}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Pincode Verification */}
                      {pincodeVerification && (
                        <div className={`mt-4 p-3 rounded-lg ${
                          pincodeVerification.deliverable 
                            ? 'bg-green-50 text-green-700' 
                            : 'bg-red-50 text-red-700'
                        }`}>
                          {pincodeVerification.message}
                          {pincodeVerification.deliverable && (
                            <span className="ml-2">
                              (Estimated delivery: {pincodeVerification.estimatedDays} days)
                            </span>
                          )}
                        </div>
                      )}

                      <div className="flex gap-3 mt-6">
                        <button
                          onClick={handleAddAddress}
                          disabled={!newAddress.name || !newAddress.mobile || !newAddress.pincode || 
                                    !newAddress.state || !newAddress.city || !newAddress.address ||
                                    (pincodeVerification && !pincodeVerification.deliverable)}
                          className="flex-1 bg-emerald-600 text-white py-2 rounded-lg hover:bg-emerald-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                        >
                          Save Address
                        </button>
                        <button
                          onClick={() => {
                            setShowAddressForm(false);
                            setPincodeVerification(null);
                          }}
                          className="px-6 border border-gray-300 rounded-lg hover:bg-gray-50"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Step 2: Delivery Options */}
              {currentStep === 2 && (
                <div>
                  <h2 className="text-2xl font-bold mb-6">Select Delivery Option</h2>
                  
                  <div className="space-y-4">
                    {/* Normal Delivery */}
                    <div
                      onClick={() => handleDeliveryChange('normal')}
                      className={`border rounded-lg p-6 cursor-pointer transition-all ${
                        deliveryOption === 'normal'
                          ? 'border-emerald-500 bg-emerald-50'
                          : 'border-gray-200 hover:border-emerald-300'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            <IconTruck size={24} className="text-blue-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg">Normal Delivery</h3>
                            <p className="text-gray-600 mt-1">Standard shipping</p>
                            <p className="text-sm text-gray-500 mt-2">
                              Estimated delivery: {estimatedDeliveryDays === 5 ? '5-7' : estimatedDeliveryDays} days
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-bold text-green-600">FREE</p>
                        </div>
                      </div>
                    </div>

                    {/* Fast Delivery */}
                    <div
                      onClick={() => handleDeliveryChange('fast')}
                      className={`border rounded-lg p-6 cursor-pointer transition-all ${
                        deliveryOption === 'fast'
                          ? 'border-emerald-500 bg-emerald-50'
                          : 'border-gray-200 hover:border-emerald-300'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                            <IconTruck size={24} className="text-orange-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg">Fast Delivery</h3>
                            <p className="text-gray-600 mt-1">Express shipping</p>
                            <p className="text-sm text-gray-500 mt-2">
                              Estimated delivery: 2-3 days
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-bold">₹50</p>
                          <p className="text-sm text-gray-500">Extra charge</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Selected Address Summary */}
                  {selectedAddress && (
                    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-medium mb-2">Delivering to:</h4>
                      <p className="text-sm text-gray-700">
                        {selectedAddress.name}, {selectedAddress.address}, {selectedAddress.city}, 
                        {selectedAddress.state} - {selectedAddress.pincode}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Step 3: Payment Method */}
              {currentStep === 3 && (
                <div>
                  <h2 className="text-2xl font-bold mb-6">Select Payment Method</h2>
                  
                  <div className="space-y-3">
                    {/* UPI */}
                    <div
                      onClick={() => setPaymentMethod('upi')}
                      className={`border rounded-lg p-4 cursor-pointer transition-all ${
                        paymentMethod === 'upi'
                          ? 'border-emerald-500 bg-emerald-50'
                          : 'border-gray-200 hover:border-emerald-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-purple-100 rounded flex items-center justify-center">
                          <span className="text-xl">📱</span>
                        </div>
                        <div>
                          <h3 className="font-semibold">UPI</h3>
                          <p className="text-sm text-gray-500">Pay via Google Pay, PhonePe, Paytm</p>
                        </div>
                      </div>
                    </div>

                    {/* Card */}
                    <div
                      onClick={() => setPaymentMethod('card')}
                      className={`border rounded-lg p-4 cursor-pointer transition-all ${
                        paymentMethod === 'card'
                          ? 'border-emerald-500 bg-emerald-50'
                          : 'border-gray-200 hover:border-emerald-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded flex items-center justify-center">
                          <IconCreditCard size={20} className="text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold">Debit/Credit Card</h3>
                          <p className="text-sm text-gray-500">Visa, Mastercard, RuPay</p>
                        </div>
                      </div>
                    </div>

                    {/* Net Banking */}
                    <div
                      onClick={() => setPaymentMethod('netbanking')}
                      className={`border rounded-lg p-4 cursor-pointer transition-all ${
                        paymentMethod === 'netbanking'
                          ? 'border-emerald-500 bg-emerald-50'
                          : 'border-gray-200 hover:border-emerald-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-100 rounded flex items-center justify-center">
                          <span className="text-xl">🏦</span>
                        </div>
                        <div>
                          <h3 className="font-semibold">Net Banking</h3>
                          <p className="text-sm text-gray-500">All major banks supported</p>
                        </div>
                      </div>
                    </div>

                    {/* Wallet */}
                    <div
                      onClick={() => setPaymentMethod('wallet')}
                      className={`border rounded-lg p-4 cursor-pointer transition-all ${
                        paymentMethod === 'wallet'
                          ? 'border-emerald-500 bg-emerald-50'
                          : 'border-gray-200 hover:border-emerald-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-yellow-100 rounded flex items-center justify-center">
                          <span className="text-xl">👝</span>
                        </div>
                        <div>
                          <h3 className="font-semibold">Digital Wallet</h3>
                          <p className="text-sm text-gray-500">Paytm, Amazon Pay, PhonePe</p>
                        </div>
                      </div>
                    </div>

                    {/* EMI */}
                    <div
                      onClick={() => setPaymentMethod('emi')}
                      className={`border rounded-lg p-4 cursor-pointer transition-all ${
                        paymentMethod === 'emi'
                          ? 'border-emerald-500 bg-emerald-50'
                          : 'border-gray-200 hover:border-emerald-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-indigo-100 rounded flex items-center justify-center">
                          <span className="text-xl">💳</span>
                        </div>
                        <div>
                          <h3 className="font-semibold">EMI</h3>
                          <p className="text-sm text-gray-500">Easy installments</p>
                        </div>
                      </div>
                    </div>

                    {/* Cash on Delivery */}
                    <div
                      onClick={() => setPaymentMethod('cod')}
                      className={`border rounded-lg p-4 cursor-pointer transition-all ${
                        paymentMethod === 'cod'
                          ? 'border-emerald-500 bg-emerald-50'
                          : 'border-gray-200 hover:border-emerald-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center">
                          <span className="text-xl">💵</span>
                        </div>
                        <div>
                          <h3 className="font-semibold">Cash on Delivery (COD)</h3>
                          <p className="text-sm text-gray-500">Pay when you receive</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Confirmation / Online Payment */}
              {currentStep === 4 && (
                <div>
                  {paymentMethod === 'cod' ? (
                    <div className="text-center py-8">
                      <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <IconCheck size={40} className="text-emerald-600" />
                      </div>
                      <h2 className="text-2xl font-bold mb-2">Ready to Place Order!</h2>
                      <p className="text-gray-600 mb-6">
                        Your order will be confirmed and you'll pay on delivery
                      </p>
                      
                      <button
                        onClick={placeOrder}
                        disabled={processingPayment}
                        className="bg-emerald-600 text-white px-8 py-3 rounded-lg hover:bg-emerald-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-lg font-semibold"
                      >
                        {processingPayment ? 'Placing Order...' : 'Confirm Order'}
                      </button>
                    </div>
                  ) : (
                    <div>
                      <h2 className="text-2xl font-bold mb-6">Complete Payment</h2>
                      {clientSecret ? (
                        <Elements stripe={stripePromise} options={{ clientSecret, appearance }}>
                          <PaymentGateway email={currentUser.email} />
                        </Elements>
                      ) : (
                        <div className="text-center py-8">
                          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                          <p className="text-gray-600">Initializing payment gateway...</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="mt-8 flex justify-between">
                {currentStep > 1 && (
                  <button
                    onClick={() => setCurrentStep(currentStep - 1)}
                    className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Back
                  </button>
                )}
                
                {currentStep < 4 && (
                  <button
                    onClick={() => {
                      if (currentStep === 3) {
                        if (paymentMethod === 'cod') {
                          console.log('COD selected, moving to confirmation');
                          setCurrentStep(4);
                        } else {
                          console.log('Online payment selected:', paymentMethod);
                          handleOnlinePayment();
                        }
                      } else {
                        setCurrentStep(currentStep + 1);
                      }
                    }}
                    disabled={!canProceedToStep(currentStep + 1) || processingPayment}
                    className="ml-auto bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    {processingPayment ? 'Processing...' : 'Continue'}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-lg">Order Summary</h3>
                <button 
                  onClick={() => {
                    const stored = localStorage.getItem('cartItems');
                    if (stored) {
                      const parsed = JSON.parse(stored);
                      setCartItems(parsed);
                      console.log('🔄 Manually refreshed cart:', parsed.length, 'items');
                    }
                  }}
                  className="text-xs text-blue-600 hover:text-blue-800"
                  title="Refresh cart"
                >
                  🔄 Refresh
                </button>
              </div>
              
              {/* Cart Items */}
              <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
                {(() => {
                  let itemsToDisplay = cartItems;
                  if (!itemsToDisplay || itemsToDisplay.length === 0) {
                    return (
                      <div className="text-center py-4">
                        <p className="text-gray-500 text-sm">Your cart is empty</p>
                        <p className="text-xs text-gray-400 mt-1">Add items from home page</p>
                      </div>
                    );
                  }
                  return itemsToDisplay.map((item, index) => {
                    const itemImage = item.images && item.images[0] 
                      ? `${API_URL}/${item.images[0]}` 
                      : (item.image ? `${API_URL}/${item.image}` : 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23f0f0f0" width="100" height="100"/%3E%3C/svg%3E');
                    return (
                      <div key={`${item._id}-${index}`} className="flex gap-3">
                        <img
                          src={itemImage}
                          alt={item.pname || 'Product'}
                          className="w-16 h-16 object-cover rounded"
                        />
                        <div className="flex-1">
                          <p className="text-sm font-medium line-clamp-2">{item.pname || item.title}</p>
                          <p className="text-sm text-gray-500">Qty: {item.quantity || 1}</p>
                          <p className="text-sm font-semibold">₹{(item.pprice || item.price || 0) * (item.quantity || 1)}</p>
                        </div>
                      </div>
                    );
                  });
                })()}
              </div>

              {/* Price Breakdown */}
              <div className="border-t pt-4 space-y-2">
                {(() => {
                  // Use cartItems or fallback to localStorage
                  let items = cartItems;
                  if (!items || items.length === 0) {
                    try {
                      const stored = localStorage.getItem('cartItems');
                      if (stored) items = JSON.parse(stored);
                    } catch (e) {}
                  }
                  
                  const itemCount = (items || []).reduce((acc, item) => acc + (item.quantity || 1), 0);
                  const subtotal = (items || []).reduce((acc, item) => 
                    acc + ((item.pprice || item.price || 0) * (item.quantity || 1)), 0
                  );
                  
                  return (
                    <>
                      <div className="flex justify-between text-sm">
                        <span>Subtotal ({itemCount} items)</span>
                        <span>₹{subtotal || 0}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Delivery Charges</span>
                        <span className={deliveryCharge === 0 ? 'text-green-600' : ''}>
                          {deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge}`}
                        </span>
                      </div>
                      <div className="flex justify-between font-bold text-lg pt-2 border-t">
                        <span>Total</span>
                        <span>₹{(subtotal || 0) + deliveryCharge}</span>
                      </div>
                    </>
                  );
                })()}
              </div>

              {/* Delivery Info */}
              {selectedAddress && (
                <div className="mt-4 pt-4 border-t">
                  <p className="text-xs text-gray-500 mb-1">Delivering to:</p>
                  <p className="text-sm font-medium">{selectedAddress.name}</p>
                  <p className="text-xs text-gray-600">
                    {selectedAddress.city}, {selectedAddress.pincode}
                  </p>
                  {estimatedDeliveryDays && (
                    <p className="text-xs text-emerald-600 mt-2">
                      Expected by: {new Date(Date.now() + estimatedDeliveryDays * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckOut;
