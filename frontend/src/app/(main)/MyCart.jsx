"use client";
import React, { useEffect, useState } from 'react'
import useCartContext from '../../context/CartContext';
import Link from 'next/link';

import { useParams, useRouter } from 'next/navigation';
import useVoiceContext from '@/context/VoiceContext';

const CartPage = () => {

  const { id } = useParams();

  const send = (e) => {
    dispatch(addToCart(e))
    toast.success("Item added In Your Cart")
  }
  const [productList, setproductList] = useState([]);
  const router = useRouter();

  const fetchUserData = async () => {
    const res = await fetch('http://localhost:5000/product/getall');

    console.log(res.status);
    if (res.status === 200) {
      const data = await res.json();
      console.log(data);
      setproductList(data);
    }
  }

  useEffect(() => {
    fetchUserData();
  }, [])


  const { setCartOpen } = useCartContext();
  const {
    cartItems,
    addItemToCart,
    removeItemFromCart,
    clearCart,
    isInCart,
    getCartTotal,
    getCartItemsCount,
    
  } = useCartContext();
  

  const {
    transcript,
    resetTranscript,
    interpretVoiceCommand,
    fillInputUsingVoice,
    performActionUsingVoice,
    finalTranscript,
    voiceResponse,
    voices,
    triggerModal,
    checkExistenceInTranscript
  } = useVoiceContext();

  useEffect(() => {
    if (finalTranscript.includes('clear card') || finalTranscript.includes('clear cart') ) {
      voiceResponse('I am closing cart page for you.');
      clearCart();
      resetTranscript();
    }else if(finalTranscript.includes('check out')){
      voiceResponse('I am redirecting you to checkout page.');
      setCartOpen(false);
      router.push('/user/checkout');
      resetTranscript();
    }
    
    
  }, [finalTranscript])
  


  const displayCartItems = () => {
    if (getCartItemsCount() === 0) return (
      <div className="text-center">
        {/* <p alt="login form" className='rounded-start mt-4 w-25 text-center' /> */}
        <h3>Your Cart is Currently Empty!</h3>
        <p className="text-muted">Before proceed to checkout you must add some products to your shopping cart. <br />You will fill a lot of interesting products on our "Product" page.</p>
        <Link className="btn rounded-pill" onClick={() => setCartOpen(false)} style={{ backgroundColor: "#4BCCF2", color: "#fff" }} href={"/productView"}>Return To Shop</Link>
      </div>
    );
    
    return cartItems.map((item) => (
      <div key={item._id} className="grid grid-cols-3 mb-4">
        <div className="">
          <img src={'http://localhost:5000/' + item.images} alt="" className="w-auto mx-auto  h-24  py-1 " style={{ objectFit: "cover" }} />


        </div>
        <div className="">
          <p className="text-muted h6">{item.pname}</p>
          <h3>{item.title}</h3>
          <p className="text-muted">{item.pcategory}</p>
        </div>
        <div className="">
          <div className="input-group flex">
            <button className="bg-gray-400 rounded text-xl text-white px-3 py-2" onClick={e => addItemToCart(item)}>+ </button>
            <input type="text" className=" w-12 px-2 text-center" value={item.quantity} />
            <button className="bg-gray-400 rounded text-xl text-white px-3 py-2" onClick={e => removeItemFromCart(item)}>-</button>
        
          </div>
          <h2 className="my-2"> ₹ {item.pprice}</h2>
        </div>
        
      </div>
      
    ));
  }
  return (
    <>


      <div
        className="relative z-10"
        aria-labelledby="slide-over-title"
        role="dialog"
        aria-modal="true"
      >


        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">

              <div className="pointer-events-auto w-screen max-w-md">
                <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                  <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                    <div className="flex items-start justify-between">
                      <h2
                        className="text-lg font-medium text-gray-900"
                        id="slide-over-title"
                      >
                        Shopping cart
                      </h2>
                      <div className="ml-3 flex h-7 items-center">
                        <button
                          type="button"
                          onClick={() => setCartOpen(false)}
                          className="relative -m-2 p-2  text-gray-400 hover:text-gray-500"
                        >
                          <span className="absolute -inset-0.5" />
                          <span className="sr-only">Close panel</span>
                          <svg
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            aria-hidden="true"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                    <div className="mt-8">
                      <div className="flow-root">
                        <ul role="list" className="-my-6 divide-y divide-gray-200">
                          <li className="flex py-6">

                            <div className="ml-4 flex flex-1 flex-col">
                              {displayCartItems()}
                            </div>
                          </li>

                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
                    <div className="flex justify-between text-base font-medium text-gray-900">
                      <p>Total: ₹{getCartTotal()}</p>
                      <p>Items: {getCartItemsCount()}</p>
                    </div>

                    <button className="bg-red-600 w-full hover:bg-red-700 rounded py-1 text-white" onClick={() => clearCart()}> Clear Cart</button>
                    <Link href='/user/checkout'><button className="bg-blue-500 text-white mt-2 hover:bg-blue-600 w-full py-1 rounded"   onClick={() => setCartOpen(false)} >Procees to Pay</button></Link>
                    <div className="mt-6 flex justify-center text-center text-sm text-gray-500">
                      <p>
                        or
                        <button onClick={() => setCartOpen(false)}
                          type="button"
                          className="font-medium text-indigo-600 hover:text-indigo-500"
                        >
                          Continue Shopping
                          <span aria-hidden="true"> →</span>
                        </button>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>



    </>
  )
}

export default CartPage