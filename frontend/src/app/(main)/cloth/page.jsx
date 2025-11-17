"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { IoSearch } from "react-icons/io5";
import {
  IconFilter,
  IconMicrophone,
  IconShoppingCart,
} from "@tabler/icons-react";
import toast from "react-hot-toast";
import useCartContext from "@/context/CartContext";
import Link from "next/link";

const Showpiece = () => {
  const [productList, setProductList] = useState([]);
  const { isInCart, addItemToCart } = useCartContext();

  const [product, setProduct] = useState([]);

  const { category } = useParams();

  const fetchShowpieceproduct = async () => {
    const res = await fetch(
      "http://localhost:5000/product/getbycategory/cloth"
    );

    console.log(res.status);

    const data = await res.json();
    console.log(data);
    if (category) {
      setProduct(data.filter((ser) => ser.category === category));
    } else {
      setProduct(data);
    }
  };

  useEffect(() => {
    fetchShowpieceproduct();
  }, []);

  const displayproductData = () => {
    if (product.length === 0) {
      return (
        <h1 className="text-center fw-bold" style={{ color: "seagreen" }}>
          No Data Found
        </h1>
      );
    }

    return product.map((product) => (
      <>
        <div className="">
          <div className="relative m-10  flex w-full max-w-xs flex-col overflow-hidden rounded-lg border border-gray-100 bg-purple-50 shadow-md">
            <Link
              className="relative mx-3 mt-3 flex h-60 overflow-hidden  rounded-xl"
              href={"/productDetail/" + product._id}
            >
              <img
                className="object-contain block m-auto h-60 w-full"
                src={`${process.env.NEXT_PUBLIC_API_URL}/${product.images[0]}`}
                alt={product.pname}
              />
            </Link>
            <div className="mt-4 px-5 pb-5">
              <a href="#">
                <h5 className="text-xl tracking-tight text-slate-900">
                  {product.pname}
                </h5>
              </a>
              <p className="mt-5">
                Sold by : {product.seller.fname} {product.seller.lname}
              </p>
              <div className="mt-2 mb-5 flex items-center justify-between">
                <p>
                  <span className="text-3xl font-bold text-slate-900">
                    ₹{product.pprice}
                  </span>
                  {/* <span className="text-sm text-slate-900 line-through">$699</span> */}
                </p>
                <div className="flex items-center">
                  <svg
                    aria-hidden="true"
                    className="h-5 w-5 text-yellow-300"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <svg
                    aria-hidden="true"
                    className="h-5 w-5 text-yellow-300"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <svg
                    aria-hidden="true"
                    className="h-5 w-5 text-yellow-300"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <svg
                    aria-hidden="true"
                    className="h-5 w-5 text-yellow-300"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <svg
                    aria-hidden="true"
                    className="h-5 w-5 text-yellow-300"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="mr-2 ml-3 rounded bg-yellow-200 px-2.5 py-0.5 text-xs font-semibold">
                    5.0
                  </span>
                </div>
              </div>
              <button
                disabled={isInCart(product)}
                onClick={(e) => addItemToCart(product)}
                className="my-2 bg-green-600 hover:bg-green-700 py-2 px-5 text-white block w-full rounded"
              >
                <IconShoppingCart className="inline" />{" "}
                {isInCart(product) ? "Already Added" : "Add to Cart"}
              </button>
            </div>
          </div>
        </div>
      </>
    ));
  };

  const filterProducts = (e) => {
    const value = e.target.value;
    setProductList(
      productList.filter((cat) => {
        return (
          cat.pname.toLowerCase().includes(value.toLowerCase()),
          cat.category.toLowerCase().includes(value.toLowerCase())
        );
      })
    );
  };

  return (
    <div className="pt-16 ">
      

      <div className="container-fluid ">
        <div className="container">
          <div className="p-2  md:p-0 grid grid-cols-1  sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3 gap-10 items-start  ">{displayproductData()}</div>
        </div>
      </div>
    </div>
  );
};

export default Showpiece;
