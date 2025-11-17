'use client'

import { useFormik } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import React, { useEffect, useState } from "react";

const About = () => {
  const feedbackSchema = Yup.object().shape({});
  const [productList, setProductList] = useState([]);

  const fetchProductData = () => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/feedback/getall`)
      .then((response) => {
        console.log(response.status);
        return response.json();
      })
      .then((data) => {
        console.log(data);
        setProductList(data);
      })
      .catch((err) => {
        console.log(err);
      });

    };
    useEffect(() => {
      fetchProductData();
    }, []);
  
  const feedbackForm = useFormik({
    initialValues: {
      name: "",
      
      email: "",
      feedback: "",
    },

    onSubmit: async (values, action) => {
      // values.image = selFile;
      console.log(values);
      const res = await fetch("http://localhost:5000/feedback/add", {
        method: "POST",
        body: JSON.stringify(values),
        headers: { "Content-type": "application/json" },
      });
      console.log(res.status);
      action.resetForm();
      if (res.status === 200) {
        toast("Feedback successfully");
      } else {
        toast("Something went wrong");
      }
    },
    validationSchema: feedbackSchema,
  });
 
  return (
  <div>
    <div className="mt-10 flex items-center justify-center gap-10 bg-white-800 ">
      <div className=" max-w-2xl p-8 bg-purple-50 shadow-md rounded-md">
        <h1 className="text-2xl font-bold mb-4">Voice-activated shopping: making your experience more intuitive and effortless..</h1>
        <p className="mb-4">
        "Welcome to BOLBAZAR, the innovative platform where you can explore and purchase a vast collection of digital content using just your voice!"
        </p>
        
      </div>
      <div className="basis-[40%] py-5 px-5 bg-purple-50">
        <img src="https://www.pngall.com/wp-content/uploads/8/Super-Market-PNG-Picture.png" alt="" class="w-full" />
      </div>
    </div>
    <div className="container mx-auto py-8">
      <h2 className="text-2xl font-bold mb-4 text-center">Our Team</h2>
      <div className="flex flex-wrap -mx-4 justify-center">
        <div className="w-full md:w-1/3 lg:w-1/4 px-4 mb-8 ">
          <div className="bg-white rounded-lg overflow-hidden shadow-md">
          <img src='WhatsApp Image 2024-01-23 at 18.44.34_569071c3.jpg' className="w-full h-70 object-cover object-center" /> 
            
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-2"> Harshit Sahu</h3>
              <p className="text-gray-600">MERN Stack Developer</p>
            </div>
          </div>
        </div>
        <div className="w-full md:w-1/3 lg:w-1/4 px-4 mb-8">
          <div className="bg-white rounded-lg overflow-hidden shadow-md">
          <img src='WhatsApp Image 2024-01-23 at 18.44.34_569071c3.jpg' className="w-full h-70 object-cover object-center" />
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-2">Hemant Singh</h3>
              <p className="text-gray-600">Frontend Developer</p>
            </div>
          </div>
        </div>
        
      </div>
    </div>
    <h2 className="text-center text-2xl p-4 font-bold mb-4">Customer Feedback</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 px-16 gap-4">
      {productList.map((feedback) => (
        <div key={feedback._id} className="bg-white p-6 shadow-md rounded">
          <p className="text-gray-800 mb-4">{feedback.feedback}</p>
          <p className="text-green-600 font-semibold">{feedback.name}</p>
        </div>
      ))}
    </div>
    <>
    {/* component */}
    <section>
    <div className="bg-white text-black py-20">
      <div className="container mx-auto flex flex-col md:flex-row my-6 md:my-24">
        <div className="flex flex-col w-full lg:w-1/3 p-8">
          <p className="ml-6 text-yellow-300 text-lg uppercase tracking-loose">
            REVIEW
          </p>
          <p className="text-3xl md:text-5xl my-4 leading-relaxed md:leading-snug">
            Leave us a feedback!
          </p>
          <p className="text-sm md:text-base leading-snug text-black-50 text-opacity-100">
            Please provide your valuable feedback and something something ...
          </p>
        </div>
        <div className="flex flex-col w-full lg:w-2/3 justify-center">
          <div className="container w-full px-4">
            <div className="flex flex-wrap justify-center">
              <div className="w-full lg:w-6/12 px-4">
                <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-purple-50">
                  <div className="flex-auto p-5 lg:p-10">
                    <h4 className="text-2xl mb-4 text-black font-semibold">
                      Have a suggestion?
                    </h4>
                    <form onSubmit={feedbackForm.handleSubmit}>
                    <div className="relative w-full mb-3">
                        <label
                          className="block uppercase text-gray-700 text-xs font-bold mb-2"
                          htmlFor="name"
                        >
                          Name
                        </label>
                        <input
                          type="name"
                          name="name"
                          id="email"
                          onChange={feedbackForm.handleChange}
                          value={feedbackForm.values.name}
                          className="border-0 px-3 py-3 rounded text-sm shadow w-full
              bg-gray-300 placeholder-black text-gray-800 outline-none focus:bg-gray-400"
                          placeholder=" "
                          style={{ transition: "all 0.15s ease 0s" }}
                          required=""
                        />
                      </div>
                      <div className="relative w-full mb-3">
                        <label
                          className="block uppercase text-gray-700 text-xs font-bold mb-2"
                          htmlFor="email"
                        >
                          Email
                        </label>
                        <input
                          type="email"
                          name="email"
                          id="email"
                          onChange={feedbackForm.handleChange}
                          value={feedbackForm.values.email}
                          className="border-0 px-3 py-3 rounded text-sm shadow w-full
              bg-gray-300 placeholder-black text-gray-800 outline-none focus:bg-gray-400"
                          placeholder=" "
                          style={{ transition: "all 0.15s ease 0s" }}
                          required=""
                        />
                      </div>
                      <div className="relative w-full mb-3">
                        <label
                          className="block uppercase text-gray-700 text-xs font-bold mb-2"
                          htmlFor="message"
                        >
                          Message
                        </label>
                        <textarea
                          maxLength={300}
                          name="feedback"
                          id="feedback"
                          onChange={feedbackForm.handleChange}
                          value={feedbackForm.values.feedback}
                          rows={4}
                          cols={80}
                          className="border-0 px-3 py-3 bg-gray-300 placeholder-black text-gray-800 rounded text-sm shadow focus:outline-none w-full"
                          placeholder=""
                          required=""
                          defaultValue={""}
                        />
                      </div>
                      <div className="text-center mt-6">
                        <button
                          id="feedbackBtn"
                          className="bg-yellow-300 text-black text-center mx-auto active:bg-yellow-400 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1"
                          type="submit"
                          style={{ transition: "all 0.15s ease 0s" }}
                        >
                          Submit
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </section>
    </>

  </div>

  )
}

export default About;