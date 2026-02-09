"use client";
import React, { useEffect, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import useCartContext from '../../context/CartContext';
import useVoiceContext from '@/context/VoiceContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const CartPage = () => {
  const router = useRouter();
  const { 
    setCartOpen, 
    cartItems, 
    addItemToCart, 
    removeItemFromCart, 
    clearCart, 
    getCartTotal, 
    getCartItemsCount 
  } = useCartContext();

  const { finalTranscript, voiceResponse, resetTranscript } = useVoiceContext();

  useEffect(() => {
    if (finalTranscript.includes('clear cart')) {
      voiceResponse('Clearing your cart.');
      clearCart();
      resetTranscript();
    } else if (finalTranscript.includes('checkout') || finalTranscript.includes('check out')) {
      voiceResponse('Redirecting to checkout.');
      setCartOpen(false);
      router.push('/user/checkout');
      resetTranscript();
    }
  }, [finalTranscript]);

  return (
    <Transition.Root show={true} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={() => setCartOpen(false)}>
        <Transition.Child
          as={Fragment}
          enter="ease-in-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-300"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/50 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-300"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-300"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                  <div className="flex h-full flex-col bg-white shadow-2xl">
                    {/* Header */}
                    <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200">
                      <Dialog.Title className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        Shopping Cart
                        <span className="bg-primary text-white text-xs font-bold px-2 py-0.5 rounded-full">
                          {getCartItemsCount()}
                        </span>
                      </Dialog.Title>
                      <button
                        type="button"
                        className="p-2 -m-2 text-gray-400 hover:text-gray-500 transition-colors"
                        onClick={() => setCartOpen(false)}
                      >
                        <XMarkIcon className="h-6 w-6" />
                      </button>
                    </div>

                    {/* Cart Items */}
                    <div className="flex-1 overflow-y-auto py-4 px-4">
                      {getCartItemsCount() === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center">
                          <div className="text-7xl mb-4">🛒</div>
                          <h3 className="text-xl font-semibold text-gray-800 mb-2">Your Cart is Empty</h3>
                          <p className="text-gray-500 mb-6 max-w-xs">
                            Looks like you haven't added anything to your cart yet. Start shopping!
                          </p>
                          <button 
                            onClick={() => setCartOpen(false)}
                            className="btn-primary"
                          >
                            Continue Shopping
                          </button>
                        </div>
                      ) : (
                        <ul className="divide-y divide-gray-100">
                          {cartItems.map((item) => (
                            <li key={item._id} className="py-4">
                              <div className="flex gap-4">
                                {/* Product Image */}
                                <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-sm bg-gray-50 border border-gray-100">
                                  <img
                                    src={item.images ? `http://localhost:5000/${item.images}` : '/placeholder.png'}
                                    alt={item.pname}
                                    className="h-full w-full object-contain p-1"
                                  />
                                </div>

                                {/* Product Details */}
                                <div className="flex-1 flex flex-col">
                                  <div>
                                    <h3 className="text-sm font-medium text-gray-900 line-clamp-2">
                                      {item.pname}
                                    </h3>
                                    {item.category && (
                                      <p className="text-xs text-gray-500 mt-0.5">{item.category}</p>
                                    )}
                                  </div>

                                  <div className="mt-auto flex items-center justify-between">
                                    <div className="flex items-center border border-gray-200 rounded-sm">
                                      <button 
                                        onClick={() => removeItemFromCart(item)}
                                        className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors"
                                      >
                                        −
                                      </button>
                                      <span className="w-10 text-center text-sm font-medium">
                                        {item.quantity}
                                      </span>
                                      <button 
                                        onClick={() => addItemToCart(item)}
                                        className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors"
                                      >
                                        +
                                      </button>
                                    </div>
                                    <span className="text-base font-semibold text-gray-900">
                                      ₹{(item.pprice * item.quantity).toLocaleString()}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>

                    {/* Footer - Only show if cart has items */}
                    {getCartItemsCount() > 0 && (
                      <div className="border-t border-gray-200 px-4 py-4 bg-gray-50">
                        {/* Price Breakdown */}
                        <div className="space-y-2 mb-4">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-500">Subtotal ({getCartItemsCount()} items)</span>
                            <span className="font-medium">₹{getCartTotal().toLocaleString()}</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-500">Delivery</span>
                            <span className="text-accent-green font-medium">FREE</span>
                          </div>
                          <div className="flex items-center justify-between text-base font-semibold pt-2 border-t border-gray-200">
                            <span>Total</span>
                            <span className="text-lg">₹{getCartTotal().toLocaleString()}</span>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="space-y-2">
                          <Link href="/user/checkout" onClick={() => setCartOpen(false)} className="block">
                            <button className="w-full bg-secondary hover:bg-secondary-dark text-white font-semibold py-3 rounded-sm transition-colors">
                              Proceed to Checkout
                            </button>
                          </Link>
                          <button
                            onClick={clearCart}
                            className="w-full border border-red-200 text-red-500 hover:bg-red-50 font-medium py-2 rounded-sm text-sm transition-colors"
                          >
                            Clear Cart
                          </button>
                        </div>

                        {/* Continue Shopping */}
                        <div className="mt-4 text-center">
                          <button
                            onClick={() => setCartOpen(false)}
                            className="text-sm text-primary hover:underline font-medium"
                          >
                            ← Continue Shopping
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default CartPage;

