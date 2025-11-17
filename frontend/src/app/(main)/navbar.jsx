"use client";
import useCartContext from "@/context/CartContext";
import useVoiceContext from "@/context/VoiceContext";
import Link from "next/link";
import React, { useEffect } from "react";
import { FiUser } from "react-icons/fi";
import CartPage from "./MyCart";


const Navbar = () => {
  const { cartItems, cartOpen, setCartOpen } = useCartContext();
  const {finalTranscript, voiceResponse, resetTranscript} = useVoiceContext();
  useEffect(() => {
    if (finalTranscript.includes('open card') || finalTranscript.includes('open card')) {
      voiceResponse('Opening cart page.');
      setCartOpen(true);
      resetTranscript(); 
    }
    else if (finalTranscript.includes('close cart') || finalTranscript.includes('close card')) {
      voiceResponse('Closing cart page');
      setCartOpen(false);
      resetTranscript();
    }
    
  }, [finalTranscript])

  return (
    <>
      {cartOpen && <CartPage />}
      <>
        {/* component */}
        {/* follow me on twitter @asad_codes */}
        <div className="flex flex-wrap place-items-center h-46  ">
          <section className="relative mx-auto">
            {/* navbar */}
            <nav className="flex justify-between  text-white w-screen bg-[#1E2852] ">
              <div className="px-5 xl:px-12 py-2 flex w-full items-center ">
                <a className="text-3xl font-bold font-heading" href="#">
                  <div className=" ">
                    <img src="bolbazar-logo.png" alt="BolBazar" className="h-16" />
                  </div>
                </a>
                {/* Nav Links */}
                <ul className="hidden md:flex px-4 mx-auto font-semibold font-heading space-x-12">
                  <li>
                    <a className="hover:text-gray-200" href="/">
                      Home
                    </a>
                  </li>
                  <li>
                    <a className="hover:text-gray-200" href="#">
                      Category
                    </a>
                  </li>
                  <li>
                    <a className="hover:text-gray-200" href="/productView">
                      Collections
                    </a>
                  </li>
                  <li>
                    <a className="hover:text-gray-200" href="/contact">
                      Contact Us
                    </a>
                  </li>
                </ul>

                {/* Header Icons */}
                <div className="hidden xl:flex items-center space-x-5 items-center">
                  <>
                    <a
                      className="flex items-center hover:text-gray-200"
                      href="/sellerLogin"
                    >
                      <FiUser />
                    </a>
                    {/* Dropdown menu */}
                    <div
                      id="dropdown"
                      className="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700"
                    >
                      <ul
                        className="py-2 text-sm text-gray-700 dark:text-gray-200"
                        aria-labelledby="dropdownDefaultButton"
                      >
                        <li>
                          <a
                            href="#"
                            className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                          >
                            Dashboard
                          </a>
                        </li>
                        <li>
                          <a
                            href="#"
                            className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                          >
                            Settings
                          </a>
                        </li>
                        <li>
                          <a
                            href="#"
                            className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                          >
                            Earnings
                          </a>
                        </li>
                        <li>
                          <a
                            href="#"
                            className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                          >
                            Sign out
                          </a>
                        </li>
                      </ul>
                    </div>
                  </>

                  <button
                    type="button"
                    className="flex items-center hover:text-gray-200"
                    onClick={() => setCartOpen(!cartOpen)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                    <span className="flex absolute -mt-5 ml-4">
                      <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-pink-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-pink-500"></span>
                    </span>
                  </button>
                  {/* Sign In / Register      */}
                  <a
                    className="flex items-center hover:text-gray-200"
                    href="/login"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 hover:text-gray-200"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </a>
                </div>
              </div>
              {/* Responsive navbar */}
              <button
                onClick={() => setCartOpen(!cartOpen)}
                className="xl:hidden flex mr-6 items-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 hover:text-gray-200"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                <span className="flex absolute -mt-5 ml-4">
                  <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-pink-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-pink-500"></span>
                </span>
                {cartItems.length}
              </button>
              <a className="navbar-burger self-center mr-12 xl:hidden" href="#">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 hover:text-gray-200"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </a>
            </nav>
          </section>
        </div>
        {/* Does this resource worth a follow? */}
      </>
    </>
  );
};

export default Navbar;
