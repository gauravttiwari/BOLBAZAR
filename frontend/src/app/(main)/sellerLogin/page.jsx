"use client";
import { useFormik } from "formik";
import * as Yup from "yup";
import React from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import useSellerContext from "@/context/SellerContext";

const Sellerlogin = () => {
  const addSellerSchema = Yup.object().shape({});
  const router = useRouter();

  const { setSellerLoggedIn } = useSellerContext();

  const addSellerForm = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    onSubmit: async (values, action) => {
      console.log(values);

      const res = await fetch("http://localhost:5000/seller/authenticate", {
        method: "POST",
        body: JSON.stringify(values),
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log(res.status);

      if (res.status === 200) {
        toast.success("Login Successfull");
        const data = await res.json();
        console.log(data);
        sessionStorage.setItem("seller", JSON.stringify(data));
        setSellerLoggedIn(true);
        action.resetForm();
        router.push("/seller/sellerdashboard");
      } else if (res.status === 400) {
        toast.error("Some error occured");
      }
    },

    validationSchema: addSellerSchema,
  });

  return (
    <>
      {/* component */}
      {/* Container */}
      <div
        className="container-fluid flex items-center justify-center bg-purple-50"
        style={{ height: "100vh" }}
      >
        <div className=" w-3/4 --tw-shadow-color: #000;  ">
          <div className="grid grid-cols-2 h-3/4">
            <div className="">
              <img
                src="https://www.pngplay.com/wp-content/uploads/6/E-Commerce-Shopping-PNG-Clipart-Background.png"
                alt=""
                className="px-5 py-4 "
              />
            </div>
            <div>
              <form onSubmit={addSellerForm.handleSubmit}>
                <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight  text-black">
                  Hey Seller, Welcome Back!
                </h2>
                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium leading-6  text-black"
                    >
                      Email address
                    </label>
                    <div className="mt-2">
                      <input
                        id="email"
                        name="email"
                        type="email"
                        onChange={addSellerForm.handleChange}
                        value={addSellerForm.values.email}
                        autoComplete="email"
                        required
                        className="block w-full rounded-md border-0 py-1.5 px-1.5 text-black shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between">
                      <label
                        htmlFor="password"
                        className="block text-sm font-medium leading-6  mt-8 text-black"
                      >
                        Password
                      </label>
                      <div className="text-sm mt-8">
                        <a
                          href="/resetPassword"
                          className="font-semibold  hover:text-[#D4A056]-500 text-[#FC9B3C] "
                        >
                          Forgot password?
                        </a>
                      </div>
                    </div>
                    <div className="mt-2">
                      <input
                        id="password"
                        name="password"
                        type="password"
                        onChange={addSellerForm.handleChange}
                        value={addSellerForm.values.password}
                        autoComplete="current-password"
                        required
                        className="block w-full rounded-md border-0 py-1.5 px-1.5 text-[#000000] shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 bg-[#ffffff]"
                      />
                    </div>
                  </div>

                  <div className="mt-10">
                    <button
                      type="submit"
                      className="flex w-full justify-center rounded-md bg-[#FC9B3C] mt-6 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-text-[#D4A056] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                      Sign in
                    </button>
                  </div>
                  <div className="text-sm mt-8 text-center">
                    <a
                      href="/seller/sellersignup"
                      className="font-semibold  hover:text-[#D4A056]-500 text-[#FC9B3C] "
                    >
                      Yet not register? Register Here!
                    </a>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sellerlogin;
