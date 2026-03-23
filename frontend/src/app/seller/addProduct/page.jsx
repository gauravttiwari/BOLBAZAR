"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import Link from "next/link";
import useSellerContext from "@/context/SellerContext";
import useVoiceContext from "@/context/VoiceContext";
import SellerSidebar from "@/components/SellerSidebar";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const addProductSchema = Yup.object().shape({
  pname: Yup.string().required("Product name is required").min(3, "Name must be at least 3 characters"),
  pdetail: Yup.string().required("Product description is required").min(10, "Description must be at least 10 characters"),
  pprice: Yup.number().required("Price is required").positive("Price must be positive"),
  category: Yup.string().required("Category is required"),
  subcategory: Yup.string().required("Subcategory is required"),
});

const AddProduct = () => {
  const router = useRouter();
  const { currentSeller, sellerReady } = useSellerContext();
  const { finalTranscript, voiceResponse, resetTranscript } = useVoiceContext();
  const [uploading, setUploading] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [subcategories, setSubcategories] = useState([]);
  const [features, setFeatures] = useState([{ name: "", value: "" }]);

  // Categories with their subcategories
  const categoryOptions = {
    "Electronics": ["Mobiles", "Laptops", "Tablets", "Cameras", "Headphones", "Smartwatches"],
    "Fashion": ["Men's Clothing", "Women's Clothing", "Kids Wear", "Footwear", "Accessories"],
    "Home & Kitchen": ["Furniture", "Home Decor", "Kitchen Appliances", "Bedding", "Cookware"],
    "Beauty & Personal Care": ["Skincare", "Makeup", "Haircare", "Fragrances", "Personal Care"],
    "Sports & Fitness": ["Gym Equipment", "Sports Wear", "Yoga", "Cycling", "Outdoor Sports"],
    "Books & Stationery": ["Fiction", "Non-Fiction", "Education", "Stationery", "Comics"],
    "Toys & Games": ["Action Figures", "Board Games", "Puzzles", "Educational Toys", "Outdoor Toys"],
    "Automotive": ["Car Accessories", "Bike Accessories", "Tools", "Car Care", "Parts"]
  };

  useEffect(() => {
    if (sellerReady && !currentSeller) {
      router.push("/sellerLogin");
    }
  }, [sellerReady, currentSeller, router]);

  const addProductForm = useFormik({
    initialValues: {
      pname: "",
      pdetail: "",
      pprice: "",
      category: "",
      subcategory: "",
      images: [],
    },
    validationSchema: addProductSchema,
    onSubmit: async (values, action) => {
      if (!uploadedImage) {
        toast.error("Please upload a product image");
        return;
      }

      // Remove any accidental seller field from values
      const { seller, ...rest } = values;
      const submitData = {
        ...rest,
        features: features.filter(f => f.name && f.value),
        images: [uploadedImage],
      };

      try {
        console.log('[DEBUG] Submitting product. Token:', currentSeller?.token);
        const res = await fetch(`${API_URL}/product/add`, {
          method: "POST",
          body: JSON.stringify(submitData),
          headers: {
            "Content-type": "application/json",
            "x-auth-token": currentSeller?.token,
          },
        });

        if (res.status === 200) {
          toast.success("Product added successfully!");
          action.resetForm();
          setUploadedImage(null);
          setFeatures([{ name: "", value: "" }]);
          router.push("/seller/manageProduct");
        } else {
          const errorMsg = await res.text();
          toast.error(`Failed to add product: ${errorMsg}`);
        }
      } catch (error) {
        console.error("Error adding product:", error);
        toast.error("Something went wrong");
      }
    },
  });

  const uploadFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const fd = new FormData();
    fd.append("myfile", file);

    try {
      const res = await fetch(`${API_URL}/util/uploadfile`, {
        method: "POST",
        body: fd,
      });

      if (res.ok) {
        // Expecting backend to return { url: "uploads/filename.jpg" }
        const data = await res.json();
        setUploadedImage(data.url); // store the URL/path, not just file name
        toast.success("Image uploaded successfully!");
      } else {
        toast.error("Failed to upload image");
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Error uploading image");
    } finally {
      setUploading(false);
    }
  };

  const updateFeature = (index, key, value) => {
    const updatedFeatures = [...features];
    updatedFeatures[index][key] = value;
    setFeatures(updatedFeatures);
  };

  const addFeature = () => {
    setFeatures([...features, { name: "", value: "" }]);
  };

  const removeFeature = (index) => {
    if (features.length > 1) {
      const updatedFeatures = features.filter((_, i) => i !== index);
      setFeatures(updatedFeatures);
    }
  };

  // Voice commands for add product
  useEffect(() => {
    if (!finalTranscript) return;
    const lower = finalTranscript.toLowerCase();

    if (lower.includes('product name:') || lower.includes('pname:')) {
      const pname = finalTranscript.replace(/product name:/i, '').replace(/pname:/i, '').trim();
      if (pname) {
        addProductForm.setFieldValue('pname', pname);
        voiceResponse('Product name set');
        resetTranscript();
        return;
      }
    }

    if (lower.includes('price:') || lower.includes('pprice:')) {
      const price = finalTranscript.replace(/price:/i, '').replace(/pprice:/i, '').trim();
      if (price && !isNaN(price)) {
        addProductForm.setFieldValue('pprice', parseFloat(price));
        voiceResponse('Price set to ' + price);
        resetTranscript();
        return;
      }
    }

    if (lower.includes('description:') || lower.includes('detail:')) {
      const detail = finalTranscript.replace(/description:/i, '').replace(/detail:/i, '').trim();
      if (detail) {
        addProductForm.setFieldValue('pdetail', detail);
        voiceResponse('Description set');
        resetTranscript();
        return;
      }
    }

    if (lower.includes('add product') || lower.includes('submit product')) {
      voiceResponse('Adding your product');
      setTimeout(() => {
        document.querySelector('button[type="submit"]')?.click();
      }, 500);
      resetTranscript();
      return;
    }
  }, [finalTranscript, voiceResponse, resetTranscript, addProductForm]);

  if (!sellerReady) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  if (!currentSeller) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <SellerSidebar />

      {/* Main Content */}
      <div className="p-4 xl:ml-80">
        {/* Header */}
        <div className="mb-8">
          <nav aria-label="breadcrumb" className="w-max">
            <ol className="flex flex-wrap items-center w-full bg-opacity-60 rounded-md bg-transparent p-0 transition-all">
              <li className="flex items-center">
                <Link href="/seller/sellerdashboard" className="text-gray-500 hover:text-emerald-600">Dashboard</Link>
                <span className="text-gray-500 mx-2">/</span>
              </li>
              <li className="flex items-center">
                <span className="text-gray-900 font-semibold">Add Product</span>
              </li>
            </ol>
          </nav>
          <h1 className="text-2xl font-bold text-gray-900 mt-2">Add New Product</h1>
        </div>

        {/* Form */}
        <form onSubmit={addProductForm.handleSubmit}>
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Main Product Info */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Information */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-emerald-600">
                    <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 01.67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 11-.671-1.34l.041-.022zM12 9a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
                  </svg>
                  Basic Information
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Product Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="pname"
                      value={addProductForm.values.pname}
                      onChange={addProductForm.handleChange}
                      onBlur={addProductForm.handleBlur}
                      placeholder="Enter product name"
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all ${
                        addProductForm.touched.pname && addProductForm.errors.pname
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    />
                    {addProductForm.touched.pname && addProductForm.errors.pname && (
                      <p className="text-red-500 text-sm mt-1">{addProductForm.errors.pname}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="pdetail"
                      value={addProductForm.values.pdetail}
                      onChange={addProductForm.handleChange}
                      onBlur={addProductForm.handleBlur}
                      rows={4}
                      placeholder="Describe your product in detail..."
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all resize-none ${
                        addProductForm.touched.pdetail && addProductForm.errors.pdetail
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    />
                    {addProductForm.touched.pdetail && addProductForm.errors.pdetail && (
                      <p className="text-red-500 text-sm mt-1">{addProductForm.errors.pdetail}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Price (₹) <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                      <input
                        type="number"
                        name="pprice"
                        value={addProductForm.values.pprice}
                        onChange={addProductForm.handleChange}
                        onBlur={addProductForm.handleBlur}
                        placeholder="0.00"
                        className={`w-full pl-8 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all ${
                          addProductForm.touched.pprice && addProductForm.errors.pprice
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                      />
                    </div>
                    {addProductForm.touched.pprice && addProductForm.errors.pprice && (
                      <p className="text-red-500 text-sm mt-1">{addProductForm.errors.pprice}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Category */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-emerald-600">
                    <path fillRule="evenodd" d="M5.25 2.25a3 3 0 00-3 3v4.318a3 3 0 00.879 2.121l9.58 9.581c.92.92 2.39 1.186 3.548.428a18.849 18.849 0 005.441-5.44c.758-1.16.492-2.629-.428-3.548l-9.58-9.581a3 3 0 00-2.122-.879H5.25zM6.375 7.5a1.125 1.125 0 100-2.25 1.125 1.125 0 000 2.25z" clipRule="evenodd" />
                  </svg>
                  Category
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="category"
                      value={addProductForm.values.category}
                      onChange={(e) => {
                        addProductForm.handleChange(e);
                        setSubcategories(categoryOptions[e.target.value] || []);
                        addProductForm.setFieldValue("subcategory", "");
                      }}
                      onBlur={addProductForm.handleBlur}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all ${
                        addProductForm.touched.category && addProductForm.errors.category
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    >
                      <option value="">Select Category</option>
                      {Object.keys(categoryOptions).map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                    {addProductForm.touched.category && addProductForm.errors.category && (
                      <p className="text-red-500 text-sm mt-1">{addProductForm.errors.category}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Subcategory <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="subcategory"
                      value={addProductForm.values.subcategory}
                      onChange={addProductForm.handleChange}
                      onBlur={addProductForm.handleBlur}
                      disabled={!addProductForm.values.category}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all disabled:bg-gray-100 disabled:cursor-not-allowed ${
                        addProductForm.touched.subcategory && addProductForm.errors.subcategory
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    >
                      <option value="">{addProductForm.values.category ? "Select Subcategory" : "Select Category First"}</option>
                      {subcategories.map((subcat) => (
                        <option key={subcat} value={subcat}>{subcat}</option>
                      ))}
                    </select>
                    {addProductForm.touched.subcategory && addProductForm.errors.subcategory && (
                      <p className="text-red-500 text-sm mt-1">{addProductForm.errors.subcategory}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Features */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-emerald-600">
                    <path fillRule="evenodd" d="M2.625 6.75a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0zm4.875 0A.75.75 0 018.25 6h12a.75.75 0 010 1.5h-12a.75.75 0 01-.75-.75zM2.625 12a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0zM7.5 12a.75.75 0 01.75-.75h12a.75.75 0 010 1.5h-12A.75.75 0 017.5 12zm-4.875 5.25a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0zm4.875 0a.75.75 0 01.75-.75h12a.75.75 0 010 1.5h-12a.75.75 0 01-.75-.75z" clipRule="evenodd" />
                  </svg>
                  Product Features
                </h3>
                <div className="space-y-3">
                  {features.map((feature, index) => (
                    <div key={index} className="flex gap-3 items-center">
                      <input
                        type="text"
                        value={feature.name}
                        onChange={(e) => updateFeature(index, "name", e.target.value)}
                        placeholder="Feature name (e.g., Color)"
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      />
                      <input
                        type="text"
                        value={feature.value}
                        onChange={(e) => updateFeature(index, "value", e.target.value)}
                        placeholder="Value (e.g., Black)"
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      />
                      <button
                        type="button"
                        onClick={() => removeFeature(index)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        disabled={features.length === 1}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                          <path fillRule="evenodd" d="M16.5 4.478v.227a48.816 48.816 0 013.878.512.75.75 0 11-.256 1.478l-.209-.035-1.005 13.07a3 3 0 01-2.991 2.77H8.084a3 3 0 01-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 01-.256-1.478A48.567 48.567 0 017.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 013.369 0c1.603.051 2.815 1.387 2.815 2.951zm-6.136-1.452a51.196 51.196 0 013.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 00-6 0v-.113c0-.794.609-1.428 1.364-1.452zm-.355 5.945a.75.75 0 10-1.5.058l.347 9a.75.75 0 101.499-.058l-.346-9zm5.48.058a.75.75 0 10-1.498-.058l-.347 9a.75.75 0 001.5.058l.345-9z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addFeature}
                    className="flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-medium"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                      <path fillRule="evenodd" d="M12 3.75a.75.75 0 01.75.75v6.75h6.75a.75.75 0 010 1.5h-6.75v6.75a.75.75 0 01-1.5 0v-6.75H4.5a.75.75 0 010-1.5h6.75V4.5a.75.75 0 01.75-.75z" clipRule="evenodd" />
                    </svg>
                    Add Feature
                  </button>
                </div>
              </div>
            </div>

            {/* Sidebar - Image Upload */}
            <div className="space-y-6">
              {/* Image Upload */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-emerald-600">
                    <path fillRule="evenodd" d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0021 18v-1.94l-2.69-2.689a1.5 1.5 0 00-2.12 0l-.88.879.97.97a.75.75 0 11-1.06 1.06l-5.16-5.159a1.5 1.5 0 00-2.12 0L3 16.061zm10.125-7.81a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0z" clipRule="evenodd" />
                  </svg>
                  Product Image
                </h3>
                
                <label
                  htmlFor="image-upload"
                  className={`flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-xl cursor-pointer transition-all ${
                    uploadedImage
                      ? "border-emerald-500 bg-emerald-50"
                      : "border-gray-300 bg-gray-50 hover:bg-gray-100"
                  }`}
                >
                  {uploading ? (
                    <div className="flex flex-col items-center">
                      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-600 mb-2"></div>
                      <p className="text-sm text-gray-500">Uploading...</p>
                    </div>
                  ) : uploadedImage ? (
                    <div className="flex flex-col items-center">
                      <img
                        src={`${API_URL}/${uploadedImage.replace(/^static\//, '')}`}
                        alt="Uploaded"
                        className="h-32 w-32 object-cover rounded-lg mb-2"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='%2310b981' viewBox='0 0 24 24'%3E%3Cpath d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z'/%3E%3C/svg%3E";
                        }}
                      />
                      <p className="text-sm text-emerald-600 font-medium">{uploadedImage.replace(/^static\//, '')}</p>
                      <p className="text-xs text-gray-500 mt-1">Click to change</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <svg className="w-10 h-10 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p className="mb-2 text-sm text-gray-500">
                        <span className="font-semibold">Click to upload</span>
                      </p>
                      <p className="text-xs text-gray-400">PNG, JPG, GIF up to 10MB</p>
                    </div>
                  )}
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    onChange={uploadFile}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Submit Button */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <button
                  type="submit"
                  disabled={addProductForm.isSubmitting}
                  className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 text-white py-3 rounded-lg font-medium hover:from-emerald-600 hover:to-emerald-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {addProductForm.isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Adding Product...
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                        <path fillRule="evenodd" d="M12 3.75a.75.75 0 01.75.75v6.75h6.75a.75.75 0 010 1.5h-6.75v6.75a.75.75 0 01-1.5 0v-6.75H4.5a.75.75 0 010-1.5h6.75V4.5a.75.75 0 01.75-.75z" clipRule="evenodd" />
                      </svg>
                      Add Product
                    </>
                  )}
                </button>
                
                <Link
                  href="/seller/manageProduct"
                  className="w-full mt-3 block text-center bg-gray-100 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-200 transition-all"
                >
                  Cancel
                </Link>
              </div>

              {/* Tips */}
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                <h4 className="font-medium text-emerald-800 mb-2 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                    <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm11.378-3.917c-.89-.777-2.366-.777-3.255 0a.75.75 0 01-.988-1.129c1.454-1.272 3.776-1.272 5.23 0 1.513 1.324 1.513 3.518 0 4.842a3.75 3.75 0 01-.837.552c-.676.328-1.028.774-1.028 1.152v.75a.75.75 0 01-1.5 0v-.75c0-1.279 1.06-2.107 1.875-2.502.182-.088.351-.199.503-.331.83-.727.83-1.857 0-2.584zM12 18a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
                  </svg>
                  Tips for better listings
                </h4>
                <ul className="text-sm text-emerald-700 space-y-1">
                  <li>• Use high-quality product images</li>
                  <li>• Write detailed descriptions</li>
                  <li>• Add relevant features</li>
                  <li>• Set competitive prices</li>
                </ul>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
