"use client";
import { useRouter } from 'next/navigation';
import { useFormik } from "formik";
import * as Yup from "yup";
const addProductSchema = Yup.object().shape({});

import toast from "react-hot-toast";
import { useState } from "react";
import useSellerContext from "@/context/SellerContext";

const Addproduct = () => {
  const router = useRouter();
  // const [selFile, setSelFile] = useState("");

  const { currentSeller } = useSellerContext();

  const [features, setFeatures] = useState([
    {
      name: "Feature name",
      value: "feature value",
    },
  ]);

  const addProductForm = useFormik({
    initialValues: {
      pname: "",
      pdetail: "",
      pprice: "",
      category: "",
      images: [],
      createdAt: "",
    },

    onSubmit: async (values, action) => {
      values.features = features;
      console.log(values);
      const res = await fetch("http://localhost:5000/product/add", {
        method: "POST",
        body: JSON.stringify(values),
        headers: { 
          "Content-type": "application/json",
          "x-auth-token" : currentSeller.token
          },
      });
      console.log(res.status);
      action.resetForm();
      if (res.status === 200) {
        toast("Item uploaded successfully");
        router.push('/seller/manageProduct');
      } else {
        toast("Something went wrong");
      }
    },
    validationSchema: addProductSchema,
  });

  const uploadFile = (e) => {
    const file = e.target.files[0];
    console.log(file);

    const fd = new FormData();
    fd.append("myfile", file);

    fetch("http://localhost:5000/util/uploadfile", { method: "POST", body: fd })
      .then((response) => {
        if (response.status === 200) {
          toast.success("file Uploaded");
          response.json().then((data) => {
            addProductForm.values.images[0] = file.name;
          });
        } else {
          toast.success("some error occured");
        }
      })
      .catch((err) => {
        console.log(err);
        toast.error("some error occured");
      });
  };

  const updateFeatures = (index, key, value) => {
    let temp = features;
    temp[index][key] = value;
    setFeatures([...temp]);
  };

  const addFeature = () => {
    setFeatures([...features, { name: "", value: "" }]);
  };

  return (
    <>
      <aside className="bg-gradient-to-br from-[#1E2852] to-[#1E2852] -translate-x-80 fixed inset-0 z-50 ms-4 mt-16 h-[calc(100vh-32px)] w-72 rounded-xl transition-transform duration-300 xl:translate-x-0">
            <div className="relative border-b border-white/20">
              <a className="flex items-center gap-4 py-6 px-8" href="/seller/sellerdashboard">
                <h6 className="block antialiased tracking-normal font-sans text-base font-semibold leading-relaxed text-white">
                  Seller Dashboard
                </h6>
              </a>
              <button
                className="middle none font-sans font-medium text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none w-8 max-w-[32px] h-8 max-h-[32px] rounded-lg text-xs text-white hover:bg-white/10 active:bg-white/30 absolute right-0 top-0 grid rounded-br-none rounded-tl-none xl:hidden"
                type="button"
              >
                <span className="absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="2.5"
                    stroke="currentColor"
                    aria-hidden="true"
                    className="h-5 w-5 text-white"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </span>
              </button>
            </div>
            <div className="m-4">
              <ul className="mb-4 flex flex-col gap-1">
                <li>
                  <a aria-current="page" className="active" href="#">
                    <button
                      className="middle none font-sans font-bold center transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-3 rounded-lg  text-white shadow-md shadow-[#FC9B3C]-500/20 hover:shadow-lg hover:bg-[#FC9B3C] active:opacity-[0.85] w-full flex items-center gap-4 px-4 capitalize"
                      type="button"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        aria-hidden="true"
                        className="w-5 h-5 text-inherit"
                      >
                        <path d="M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.06l-8.689-8.69a2.25 2.25 0 00-3.182 0l-8.69 8.69a.75.75 0 001.061 1.06l8.69-8.69z" />
                        <path d="M12 5.432l8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75V21a.75.75 0 01-.75.75H5.625a1.875 1.875 0 01-1.875-1.875v-6.198a2.29 2.29 0 00.091-.086L12 5.43z" />
                      </svg>
                      <p className="block antialiased font-sans text-base leading-relaxed text-inherit font-medium capitalize">
                        dashboard
                      </p>
                    </button>
                  </a>
                </li>
                <li>
                  <a className="" href="/seller/sellerProfile">
                    <button
                      className="middle none font-sans font-bold center transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-3 rounded-lg text-white hover:bg-[#FC9B3C] active:bg-white/30 w-full flex items-center gap-4 px-4 capitalize"
                      type="button"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        aria-hidden="true"
                        className="w-5 h-5 text-inherit"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 003.065 7.097A9.716 9.716 0 0012 21.75a9.716 9.716 0 006.685-2.653zm-12.54-1.285A7.486 7.486 0 0112 15a7.486 7.486 0 015.855 2.812A8.224 8.224 0 0112 20.25a8.224 8.224 0 01-5.855-2.438zM15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <p className="block antialiased font-sans text-base leading-relaxed text-inherit font-medium capitalize">
                        profile
                      </p>
                    </button>
                  </a>
                </li>
                <li>
                  <a className="" href="/seller/manageProduct">
                    <button
                      className="middle none font-sans font-bold center transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-3 rounded-lg text-white hover:bg-[#FC9B3C] active:bg-white/30 w-full flex items-center gap-4 px-4 capitalize"
                      type="button"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        aria-hidden="true"
                        className="w-5 h-5 text-inherit"
                      >
                        <path
                          fillRule="evenodd"
                          d="M1.5 5.625c0-1.036.84-1.875 1.875-1.875h17.25c1.035 0 1.875.84 1.875 1.875v12.75c0 1.035-.84 1.875-1.875 1.875H3.375A1.875 1.875 0 011.5 18.375V5.625zM21 9.375A.375.375 0 0020.625 9h-7.5a.375.375 0 00-.375.375v1.5c0 .207.168.375.375.375h7.5a.375.375 0 00.375-.375v-1.5zm0 3.75a.375.375 0 00-.375-.375h-7.5a.375.375 0 00-.375.375v1.5c0 .207.168.375.375.375h7.5a.375.375 0 00.375-.375v-1.5zm0 3.75a.375.375 0 00-.375-.375h-7.5a.375.375 0 00-.375.375v1.5c0 .207.168.375.375.375h7.5a.375.375 0 00.375-.375v-1.5zM10.875 18.75a.375.375 0 00.375-.375v-1.5a.375.375 0 00-.375-.375h-7.5a.375.375 0 00-.375.375v1.5c0 .207.168.375.375.375h7.5zM3.375 15h7.5a.375.375 0 00.375-.375v-1.5a.375.375 0 00-.375-.375h-7.5a.375.375 0 00-.375.375v1.5c0 .207.168.375.375.375zm0-3.75h7.5a.375.375 0 00.375-.375v-1.5A.375.375 0 0010.875 9h-7.5A.375.375 0 003 9.375v1.5c0 .207.168.375.375.375z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <p className="block antialiased font-sans text-base leading-relaxed text-inherit font-medium capitalize">
                        Manage Product
                      </p>
                    </button>
                  </a>
                </li>
                <li>
                  <a className="" href="/seller/addProduct">
                    <button
                      className="middle none font-sans font-bold center transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-3 rounded-lg text-white hover:bg-[#FC9B3C] active:bg-white/30 w-full flex items-center gap-4 px-4 capitalize"
                      type="button"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        aria-hidden="true"
                        className="w-5 h-5 text-inherit"
                      >
                        <path
                          fillRule="evenodd"
                          d="M1.5 5.625c0-1.036.84-1.875 1.875-1.875h17.25c1.035 0 1.875.84 1.875 1.875v12.75c0 1.035-.84 1.875-1.875 1.875H3.375A1.875 1.875 0 011.5 18.375V5.625zM21 9.375A.375.375 0 0020.625 9h-7.5a.375.375 0 00-.375.375v1.5c0 .207.168.375.375.375h7.5a.375.375 0 00.375-.375v-1.5zm0 3.75a.375.375 0 00-.375-.375h-7.5a.375.375 0 00-.375.375v1.5c0 .207.168.375.375.375h7.5a.375.375 0 00.375-.375v-1.5zm0 3.75a.375.375 0 00-.375-.375h-7.5a.375.375 0 00-.375.375v1.5c0 .207.168.375.375.375h7.5a.375.375 0 00.375-.375v-1.5zM10.875 18.75a.375.375 0 00.375-.375v-1.5a.375.375 0 00-.375-.375h-7.5a.375.375 0 00-.375.375v1.5c0 .207.168.375.375.375h7.5zM3.375 15h7.5a.375.375 0 00.375-.375v-1.5a.375.375 0 00-.375-.375h-7.5a.375.375 0 00-.375.375v1.5c0 .207.168.375.375.375zm0-3.75h7.5a.375.375 0 00.375-.375v-1.5A.375.375 0 0010.875 9h-7.5A.375.375 0 003 9.375v1.5c0 .207.168.375.375.375z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <p className="block antialiased font-sans text-base leading-relaxed text-inherit font-medium capitalize">
                        Add Product
                      </p>
                    </button>
                  </a>
                </li>
                <li>
                  <a className="" href="#">
                    <button
                      className="middle none font-sans font-bold center transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-3 rounded-lg text-white hover:bg-[#FC9B3C] active:bg-white/30 w-full flex items-center gap-4 px-4 capitalize"
                      type="button"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        aria-hidden="true"
                        className="w-5 h-5 text-inherit"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.25 9a6.75 6.75 0 0113.5 0v.75c0 2.123.8 4.057 2.118 5.52a.75.75 0 01-.297 1.206c-1.544.57-3.16.99-4.831 1.243a3.75 3.75 0 11-7.48 0 24.585 24.585 0 01-4.831-1.244.75.75 0 01-.298-1.205A8.217 8.217 0 005.25 9.75V9zm4.502 8.9a2.25 2.25 0 104.496 0 25.057 25.057 0 01-4.496 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <p className="block antialiased font-sans text-base leading-relaxed text-inherit font-medium capitalize">
                        notifactions
                      </p>
                    </button>
                  </a>
                </li>
              </ul>
              <ul className="mb-4 flex flex-col gap-1">
                <li className="mx-3.5 mt-4 mb-2">
                  <p className="block antialiased font-sans text-sm leading-normal text-white font-black uppercase opacity-75">
                    auth pages
                  </p>
                </li>
                <li>
                  <a className="" href="/login">
                    <button
                      className="middle none font-sans font-bold center transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-3 rounded-lg text-white hover:bg-[#FC9B3C] active:bg-white/30 w-full flex items-center gap-4 px-4 capitalize"
                      type="button"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        aria-hidden="true"
                        className="w-5 h-5 text-inherit"
                      >
                        <path
                          fillRule="evenodd"
                          d="M7.5 3.75A1.5 1.5 0 006 5.25v13.5a1.5 1.5 0 001.5 1.5h6a1.5 1.5 0 001.5-1.5V15a.75.75 0 011.5 0v3.75a3 3 0 01-3 3h-6a3 3 0 01-3-3V5.25a3 3 0 013-3h6a3 3 0 013 3V9A.75.75 0 0115 9V5.25a1.5 1.5 0 00-1.5-1.5h-6zm10.72 4.72a.75.75 0 011.06 0l3 3a.75.75 0 010 1.06l-3 3a.75.75 0 11-1.06-1.06l1.72-1.72H9a.75.75 0 010-1.5h10.94l-1.72-1.72a.75.75 0 010-1.06z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <p className="block antialiased font-sans text-base leading-relaxed text-inherit font-medium capitalize">
                        sign in
                      </p>
                    </button>
                  </a>
                </li>
                <li>
                  <a className="" href="/signup">
                    <button
                      className="middle none font-sans font-bold center transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-3 rounded-lg text-white hover:bg-[#FC9B3C] active:bg-white/30 w-full flex items-center gap-4 px-4 capitalize"
                      type="button"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        aria-hidden="true"
                        className="w-5 h-5 text-inherit"
                      >
                        <path d="M6.25 6.375a4.125 4.125 0 118.25 0 4.125 4.125 0 01-8.25 0zM3.25 19.125a7.125 7.125 0 0114.25 0v.003l-.001.119a.75.75 0 01-.363.63 13.067 13.067 0 01-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 01-.364-.63l-.001-.122zM19.75 7.5a.75.75 0 00-1.5 0v2.25H16a.75.75 0 000 1.5h2.25v2.25a.75.75 0 001.5 0v-2.25H22a.75.75 0 000-1.5h-2.25V7.5z" />
                      </svg>
                      <p className="block antialiased font-sans text-base leading-relaxed text-inherit font-medium capitalize">
                        sign up
                      </p>
                    </button>
                  </a>
                </li>
              </ul>
            </div>
          </aside>
      <div className="max-w-screen-lg mx-auto p-5 h-screen">
        <div className="flex items-center justify-center">
          <form
            onSubmit={addProductForm.handleSubmit}
            className="mb-2 w-50 m-auto mt-5 p-10 bg-purple-50 "
          >
            <div className="form-group">
              <label htmlFor="pname" className="mt-5 mb-2">
                Product Name
              </label>
              <input
                type="text"
                name="pname"
                onChange={addProductForm.handleChange}
                value={addProductForm.values.pname}
                className="w-full bg-gray-300 py-1 rounded mb-3"
                required=""
              />
            </div>

            <div className="form-group">
              <label htmlFor="pdetail" className="mb-2">
                Product Detail
              </label>
              <textarea
                name="pdetail"
                onChange={addProductForm.handleChange}
                value={addProductForm.values.pdetail}
                className="w-full bg-gray-300 py-1 rounded mb-3"
                required=""
              />
            </div>
            <div className="form-group">
              <label htmlFor="pprice" className="mb-2">
                Product Price
              </label>
              <textarea
                name="pprice"
                onChange={addProductForm.handleChange}
                value={addProductForm.values.pprice}
                className="w-full bg-gray-300 py-1 rounded mb-3"
                required=""
              />
            </div>
            <div className="form-group">
              <label htmlFor="pcategory" className="mb-2">
                Product Category
              </label>
              <input
                name="category"
                onChange={addProductForm.handleChange}
                value={addProductForm.values.category}
                className="w-full bg-gray-300 py-1 rounded mb-3"
                required=""
              />
            </div>

            {features.map(({ name, value }, index) => (
              <div className='form-group grid cols-2'>
                <label htmlFor="">
                  Product Feature
                </label>
                <input
                  onChange={(e) => {
                    updateFeatures(index, "name", e.target.value);
                  }}
                  value={name}
                  className="w-1/2 bg-gray-300 pe-2 rounded mb-3"
                />
                <label htmlFor="">Feature Name</label>
                <input
                  onChange={(e) => {
                    updateFeatures(index, "value", e.target.value);
                  }}
                  value={value}
                  className="w-1/2 bg-gray-300  rounded mb-3"
                />
              </div>
            ))}

            <button className="bg-red-500 text-white   mb-5 w-full py-1 rounded-lg" type="button" onClick={addFeature}>Add New Feature</button>

            <div className="flex items-center justify-center w-full">
              <label
                htmlFor="dropzone-file"
                className="flex flex-col items-center justify-center w-full h-58 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <svg
                    className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 20 16"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                    />
                  </svg>
                  <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-semibold">Click to upload</span> or
                    drag and drop
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    SVG, PNG, JPG or GIF (MAX. 800x400px)
                  </p>
                </div>
                <input
                name="images"
                  id="dropzone-file"
                  type="file"
                  onChange={uploadFile}
                  className="hidden"
                />
              </label>
            </div>

            <div className="mt-3">
              <button
                type="submit"
                className="bg-red-500 text-white  mb-5 w-full py-1 rounded-lg"
              >
                {" "}
                Add Product
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Addproduct;
