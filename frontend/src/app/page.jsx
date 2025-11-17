"use client";
import Navbar from "./(main)/navbar";
import Footer from "./(main)/footer";
import React, { useRef, useState } from "react";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import 'swiper/css/pagination';
import "swiper/css/navigation";
import { Autoplay, Pagination } from 'swiper/modules';
import Link from "next/link";


const Home = () => {
  return (
    <>
      
      <Navbar />
      
      <>
        <section>
        <Swiper
        spaceBetween={30}
        centeredSlides={true}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
        }}
       
        modules={[Autoplay, Pagination]}
        className="mySwiper h-96 w-full "
      >
        <SwiperSlide style={{backgroundSize:"cover"}} className="bg-[url('https://wallpaperaccess.com/full/1448067.jpg')]"></SwiperSlide>

        <SwiperSlide  style={{backgroundSize:"cover"}} className="bg-[url('https://cdn.thecoolist.com/wp-content/uploads/2021/05/Men-clothing-websites.jpg')]"></SwiperSlide>
        <SwiperSlide style={{backgroundSize:"cover"}} className=" bg-[url('https://wallpaperaccess.com/full/5633830.jpg')]"></SwiperSlide>
        
      </Swiper>
        </section>

        <section>
          <div className="w-[1200] grid lg:grid-cols-6 bg-[#1E2852] mx-auto text-white text-center py-5">
            
          </div>
        </section>
        <div className="container pt-5 mx-auto px-6">
        <div
          className="h-80 rounded-md overflow-hidden bg-cover bg-center"
          style={{
            backgroundImage:
              'url("https://tennisqa.com/wp-content/uploads/2023/02/JVTXrkBQt5asxTkDirSbWd-scaled.jpg")'
          }}
        >
          <div className="bg-gray-900 bg-opacity-50 flex items-center h-full">
            <div className="px-10 max-w-xl">
              <h2 className="text-2xl text-white font-semibold">Sport Shoes</h2>
              <p className="mt-2 text-gray-400">
                Lorem ipsum dolor, sit amet consectetur adipisicing elit. Tempore
                facere provident molestias ipsam sint voluptatum pariatur.
              </p>
              <Link href={"/productView"} className="flex items-center mt-4 px-3 py-2 bg-blue-600 text-white text-sm uppercase font-medium rounded hover:bg-blue-500 focus:outline-none focus:bg-blue-500">
                <span>Shop Now</span>
                <svg
                  className="h-5 w-5 mx-2"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
        <div className="md:flex mt-8 md:-mx-4">
          <div
            className="w-full h-64 md:mx-4 rounded-md overflow-hidden bg-cover bg-center md:w-1/2"
            style={{
              backgroundImage:
                'url("https://media.casioindiashop.com/assets/category-trending-images/desktop/18.webp")'
            }}
          >
            <div className="bg-gray-900 bg-opacity-50 flex items-center h-full">
              <div className="px-10 max-w-xl">
                <h2 className="text-2xl text-white font-semibold">Watches</h2>
                <p className="mt-2 text-gray-400">
                  Lorem ipsum dolor, sit amet consectetur adipisicing elit. Tempore
                  facere provident molestias ipsam sint voluptatum pariatur.
                </p>
                <button className="flex items-center mt-4 text-white text-sm uppercase font-medium rounded hover:underline focus:outline-none">
                  <span>Shop Now</span>
                  <svg
                    className="h-5 w-5 mx-2"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
          <div
            className="w-full h-64 mt-8 md:mx-4 rounded-md overflow-hidden bg-cover bg-center md:mt-0 md:w-1/2"
            style={{
              backgroundImage:
                'url("https://www.modernquests.com/cdn/shop/files/outback-minimal-leather-wallet-tan-6.jpg?v=1690047623")'
            }}
          >
            <div className="bg-gray-900 bg-opacity-50 flex items-center h-full">
              <div className="px-10 max-w-xl">
                <h2 className="text-2xl text-white font-semibold">Wallets</h2>
                <p className="mt-2 text-gray-400">
                  Lorem ipsum dolor, sit amet consectetur adipisicing elit. Tempore
                  facere provident molestias ipsam sint voluptatum pariatur.
                </p>
                <button className="flex items-center mt-4 text-white text-sm uppercase font-medium rounded hover:underline focus:outline-none">
                  <span>Shop Now</span>
                  <svg
                    className="h-5 w-5 mx-2"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-16">
          <h3 className="text-gray-600 text-2xl font-medium">Fashions</h3>
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-6">
            <div className="w-full max-w-sm mx-auto rounded-md shadow-md overflow-hidden">
              <div
                className="flex items-end justify-end h-56 w-full bg-cover"
                style={{
                  backgroundImage:
                    'url("https://images.unsplash.com/photo-1563170351-be82bc888aa4?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=376&q=80")'
                }}
              >
                <button className="p-2 rounded-full bg-blue-600 text-white mx-5 -mb-4 hover:bg-blue-500 focus:outline-none focus:bg-blue-500">
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </button>
              </div>
              <div className="px-5 py-3">
                <h3 className="text-gray-700 uppercase">Chanel</h3>
                <span className="text-gray-500 mt-2">$12</span>
              </div>
            </div>
            <div className="w-full max-w-sm mx-auto rounded-md shadow-md overflow-hidden">
              <div
                className="flex items-end justify-end h-56 w-full bg-cover"
                style={{
                  backgroundImage:
                    'url("https://images.unsplash.com/photo-1544441893-675973e31985?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1500&q=80")'
                }}
              >
                <button className="p-2 rounded-full bg-blue-600 text-white mx-5 -mb-4 hover:bg-blue-500 focus:outline-none focus:bg-blue-500">
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </button>
              </div>
              <div className="px-5 py-3">
                <h3 className="text-gray-700 uppercase">Man Mix</h3>
                <span className="text-gray-500 mt-2">$12</span>
              </div>
            </div>
            <div className="w-full max-w-sm mx-auto rounded-md shadow-md overflow-hidden">
              <div
                className="flex items-end justify-end h-56 w-full bg-cover"
                style={{
                  backgroundImage:
                    'url("https://images.unsplash.com/photo-1532667449560-72a95c8d381b?ixlib=rb-1.2.1&auto=format&fit=crop&w=750&q=80")'
                }}
              >
                <button className="p-2 rounded-full bg-blue-600 text-white mx-5 -mb-4 hover:bg-blue-500 focus:outline-none focus:bg-blue-500">
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </button>
              </div>
              <div className="px-5 py-3">
                <h3 className="text-gray-700 uppercase">Classic watch</h3>
                <span className="text-gray-500 mt-2">$12</span>
              </div>
            </div>
            <div className="w-full max-w-sm mx-auto rounded-md shadow-md overflow-hidden">
              <div
                className="flex items-end justify-end h-56 w-full bg-cover"
                style={{
                  backgroundImage:
                    'url("https://images.unsplash.com/photo-1590664863685-a99ef05e9f61?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=345&q=80")'
                }}
              >
                <button className="p-2 rounded-full bg-blue-600 text-white mx-5 -mb-4 hover:bg-blue-500 focus:outline-none focus:bg-blue-500">
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </button>
              </div>
              <div className="px-5 py-3">
                <h3 className="text-gray-700 uppercase">woman mix</h3>
                <span className="text-gray-500 mt-2">$12</span>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-16">
          <h3 className="text-gray-600 text-2xl font-medium">Fashions</h3>
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-6">
            <div className="w-full max-w-sm mx-auto rounded-md shadow-md overflow-hidden">
              <div
                className="flex items-end justify-end h-56 w-full bg-cover"
                style={{
                  backgroundImage:
                    'url("https://images.unsplash.com/photo-1563170351-be82bc888aa4?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=376&q=80")'
                }}
              >
                <button className="p-2 rounded-full bg-blue-600 text-white mx-5 -mb-4 hover:bg-blue-500 focus:outline-none focus:bg-blue-500">
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </button>
              </div>
              <div className="px-5 py-3">
                <h3 className="text-gray-700 uppercase">Chanel</h3>
                <span className="text-gray-500 mt-2">$12</span>
              </div>
            </div>
            <div className="w-full max-w-sm mx-auto rounded-md shadow-md overflow-hidden">
              <div
                className="flex items-end justify-end h-56 w-full bg-cover"
                style={{
                  backgroundImage:
                    'url("https://images.unsplash.com/photo-1544441893-675973e31985?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1500&q=80")'
                }}
              >
                <button className="p-2 rounded-full bg-blue-600 text-white mx-5 -mb-4 hover:bg-blue-500 focus:outline-none focus:bg-blue-500">
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </button>
              </div>
              <div className="px-5 py-3">
                <h3 className="text-gray-700 uppercase">Man Mix</h3>
                <span className="text-gray-500 mt-2">$12</span>
              </div>
            </div>
            <div className="w-full max-w-sm mx-auto rounded-md shadow-md overflow-hidden">
              <div
                className="flex items-end justify-end h-56 w-full bg-cover"
                style={{
                  backgroundImage:
                    'url("https://images.unsplash.com/photo-1532667449560-72a95c8d381b?ixlib=rb-1.2.1&auto=format&fit=crop&w=750&q=80")'
                }}
              >
                <button className="p-2 rounded-full bg-blue-600 text-white mx-5 -mb-4 hover:bg-blue-500 focus:outline-none focus:bg-blue-500">
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </button>
              </div>
              <div className="px-5 py-3">
                <h3 className="text-gray-700 uppercase">Classic watch</h3>
                <span className="text-gray-500 mt-2">$12</span>
              </div>
            </div>
            <div className="w-full max-w-sm mx-auto rounded-md shadow-md overflow-hidden">
              <div
                className="flex items-end justify-end h-56 w-full bg-cover"
                style={{
                  backgroundImage:
                    'url("https://images.unsplash.com/photo-1590664863685-a99ef05e9f61?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=345&q=80")'
                }}
              >
                <button className="p-2 rounded-full bg-blue-600 text-white mx-5 -mb-4 hover:bg-blue-500 focus:outline-none focus:bg-blue-500">
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </button>
              </div>
              <div className="px-5 py-3">
                <h3 className="text-gray-700 uppercase">woman mix</h3>
                <span className="text-gray-500 mt-2">$12</span>
              </div>
            </div>
          </div>
        </div>
      </div>


        {/* <section>
          <div className="container justify-center items-center h-100vh  px-14 py-5">
            <div className="text-center ">
              <h1> Big Brand Party</h1>
            </div>
            <div className="grid lg:grid-rows-4 mt-3">
              <div className="w-[1200] grid lg:grid-cols-6 items-center justify-center mt-3 ">
                <div className="card w-56 h-60 me-3 bg-cover bg-[url('https://imgmedia.lbb.in/media/2019/04/5caf784d6e20a824c4cd7526_1555003469154.jpg')]"></div>
                <div className="card w-56 h-60 me-3 bg-cover  bg-[url('https://lh3.googleusercontent.com/-w-vj8zhs9sk/WtsrbrEnwUI/AAAAAAAAdXU/BcxGl8WGWr04BgPpJzzrrjNnBveAWOOVQCHMYCw/s0/african-women-fashion-styles0951.jpg')]"></div>
                <div className="card w-56 h-60 me-3 bg-cover bg-[url('https://imgmedia.lbb.in/media/2019/04/5caf784d6e20a824c4cd7526_1555003469154.jpg')]"></div>
                <div className="card w-56 h-60 me-3 bg-cover  bg-[url('https://lh3.googleusercontent.com/-w-vj8zhs9sk/WtsrbrEnwUI/AAAAAAAAdXU/BcxGl8WGWr04BgPpJzzrrjNnBveAWOOVQCHMYCw/s0/african-women-fashion-styles0951.jpg')]"></div>
                <div className="card w-56 h-60 me-3 bg-cover bg-[url('https://imgmedia.lbb.in/media/2019/04/5caf784d6e20a824c4cd7526_1555003469154.jpg')]"></div>
                <div className="card w-56 h-60 me-3 bg-cover  bg-[url('https://lh3.googleusercontent.com/-w-vj8zhs9sk/WtsrbrEnwUI/AAAAAAAAdXU/BcxGl8WGWr04BgPpJzzrrjNnBveAWOOVQCHMYCw/s0/african-women-fashion-styles0951.jpg')]"></div>
              </div>
              <div className="w-[1200] grid lg:grid-cols-6 items-center justify-center mt-3">
                <div className="card w-56 h-60 me-3 bg-cover bg-[url('https://imgmedia.lbb.in/media/2019/04/5caf784d6e20a824c4cd7526_1555003469154.jpg')]"></div>
                <div className="card w-56 h-60 me-3 bg-cover  bg-[url('https://lh3.googleusercontent.com/-w-vj8zhs9sk/WtsrbrEnwUI/AAAAAAAAdXU/BcxGl8WGWr04BgPpJzzrrjNnBveAWOOVQCHMYCw/s0/african-women-fashion-styles0951.jpg')]"></div>
                <div className="card w-56 h-60 me-3 bg-cover bg-[url('https://imgmedia.lbb.in/media/2019/04/5caf784d6e20a824c4cd7526_1555003469154.jpg')]"></div>
                <div className="card w-56 h-60 me-3 bg-cover  bg-[url('https://lh3.googleusercontent.com/-w-vj8zhs9sk/WtsrbrEnwUI/AAAAAAAAdXU/BcxGl8WGWr04BgPpJzzrrjNnBveAWOOVQCHMYCw/s0/african-women-fashion-styles0951.jpg')]"></div>
                <div className="card w-56 h-60 me-3 bg-cover bg-[url('https://imgmedia.lbb.in/media/2019/04/5caf784d6e20a824c4cd7526_1555003469154.jpg')]"></div>
                <div className="card w-56 h-60 me-3 bg-cover  bg-[url('https://lh3.googleusercontent.com/-w-vj8zhs9sk/WtsrbrEnwUI/AAAAAAAAdXU/BcxGl8WGWr04BgPpJzzrrjNnBveAWOOVQCHMYCw/s0/african-women-fashion-styles0951.jpg')]"></div>
              </div>
              <div className="w-[1200] grid lg:grid-cols-6 items-center justify-center mt-3">
                <div className="card w-56 h-60 me-3 bg-cover bg-[url('https://imgmedia.lbb.in/media/2019/04/5caf784d6e20a824c4cd7526_1555003469154.jpg')]"></div>
                <div className="card w-56 h-60 me-3 bg-cover  bg-[url('https://lh3.googleusercontent.com/-w-vj8zhs9sk/WtsrbrEnwUI/AAAAAAAAdXU/BcxGl8WGWr04BgPpJzzrrjNnBveAWOOVQCHMYCw/s0/african-women-fashion-styles0951.jpg')]"></div>
                <div className="card w-56 h-60 me-3 bg-cover bg-[url('https://imgmedia.lbb.in/media/2019/04/5caf784d6e20a824c4cd7526_1555003469154.jpg')]"></div>
                <div className="card w-56 h-60 me-3 bg-cover  bg-[url('https://lh3.googleusercontent.com/-w-vj8zhs9sk/WtsrbrEnwUI/AAAAAAAAdXU/BcxGl8WGWr04BgPpJzzrrjNnBveAWOOVQCHMYCw/s0/african-women-fashion-styles0951.jpg')]"></div>
                <div className="card w-56 h-60 me-3 bg-cover bg-[url('https://imgmedia.lbb.in/media/2019/04/5caf784d6e20a824c4cd7526_1555003469154.jpg')]"></div>
                <div className="card w-56 h-60 me-3 bg-cover  bg-[url('https://lh3.googleusercontent.com/-w-vj8zhs9sk/WtsrbrEnwUI/AAAAAAAAdXU/BcxGl8WGWr04BgPpJzzrrjNnBveAWOOVQCHMYCw/s0/african-women-fashion-styles0951.jpg')]"></div>
              </div>
              <div className="w-[1200] grid lg:grid-cols-6 items-center justify-center mt-3">
                <div className="card w-56 h-60 me-3 bg-cover bg-[url('https://imgmedia.lbb.in/media/2019/04/5caf784d6e20a824c4cd7526_1555003469154.jpg')]"></div>
                <div className="card w-56 h-60 me-3 bg-cover  bg-[url('https://lh3.googleusercontent.com/-w-vj8zhs9sk/WtsrbrEnwUI/AAAAAAAAdXU/BcxGl8WGWr04BgPpJzzrrjNnBveAWOOVQCHMYCw/s0/african-women-fashion-styles0951.jpg')]"></div>
                <div className="card w-56 h-60 me-3 bg-cover bg-[url('https://imgmedia.lbb.in/media/2019/04/5caf784d6e20a824c4cd7526_1555003469154.jpg')]"></div>
                <div className="card w-56 h-60 me-3 bg-cover  bg-[url('https://lh3.googleusercontent.com/-w-vj8zhs9sk/WtsrbrEnwUI/AAAAAAAAdXU/BcxGl8WGWr04BgPpJzzrrjNnBveAWOOVQCHMYCw/s0/african-women-fashion-styles0951.jpg')]"></div>
                <div className="card w-56 h-60 me-3 bg-cover bg-[url('https://imgmedia.lbb.in/media/2019/04/5caf784d6e20a824c4cd7526_1555003469154.jpg')]"></div>
                <div className="card w-56 h-60 me-3 bg-cover  bg-[url('https://lh3.googleusercontent.com/-w-vj8zhs9sk/WtsrbrEnwUI/AAAAAAAAdXU/BcxGl8WGWr04BgPpJzzrrjNnBveAWOOVQCHMYCw/s0/african-women-fashion-styles0951.jpg')]"></div>
              </div>
            </div>
          </div>
        </section> */}
        
      
      </>
      <Footer/>
      
    </>
    
  );
};

export default Home;
