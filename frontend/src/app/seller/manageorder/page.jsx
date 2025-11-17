"use client";
import useSellerContext from "@/context/SellerContext";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

const ManageProduct = () => {
  const [orderList, setOrderList] = useState([]);
  const { currentSeller } = useSellerContext();

  const fetchOrderData = () => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/order/getall`, {
      headers: {
        "x-auth-token": currentSeller.token,
      },
    })
      .then((response) => {
        console.log(response.status);
        return response.json();
      })
      .then((data) => {
        console.log(data);
        setOrderList(data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    fetchOrderData();
  }, []);

  const deleteOrder = (id) => {
    fetch("http://localhost:5000/order/delete/" + id, { method: "DELETE" })
      .then((response) => {
        if (response.status === 200) {
          toast.success("Successfully deleted!");
          fetchOrderData();
        } else {
          toast.error("Some error occured");
        }
      })
      .catch((err) => {
        console.log(err);
        toast.error("Some error occured");
      });
  };

  return (
    <>
      <div className="relative flex flex-col w-full h-full overflow-scroll text-gray-700 bg-white shadow-md bg-clip-border rounded-xl">
        <Link
          href={"/seller/addProduct"}
          type="button"
          className="focus:outline-none text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900 border gray-200"
        >
          Add Product
        </Link>
        <table className="w-full text-left table-auto min-w-max">
          <thead>
            <tr>
              <th className="p-4 border-b border-blue-gray-100 bg-blue-gray-50">
                <p className="block font-sans text-sm antialiased font-normal leading-none text-blue-gray-900 opacity-70">
                  Profile Picture
                </p>
              </th>
              <th className="p-4 border-b border-blue-gray-100 bg-blue-gray-50">
                <p className="block font-sans text-sm antialiased font-normal leading-none text-blue-gray-900 opacity-70">
                  Name
                </p>
              </th>
              <th className="p-4 border-b border-blue-gray-100 bg-blue-gray-50">
                <p className="block font-sans text-sm antialiased font-normal leading-none text-blue-gray-900 opacity-70">
                  Detail
                </p>
              </th>
              <th className="p-4 border-b border-blue-gray-100 bg-blue-gray-50">
                <p className="block font-sans text-sm antialiased font-normal leading-none text-blue-gray-900 opacity-70">
                  Product Price
                </p>
              </th>
              <th className="p-4 border-b border-blue-gray-100 bg-blue-gray-50">
                <p className="block font-sans text-sm antialiased font-normal leading-none text-blue-gray-900 opacity-70">
                  Product Category
                </p>
              </th>
              <th className="p-4 border-b border-blue-gray-100 bg-blue-gray-50">
                <p className="block font-sans text-sm antialiased font-normal leading-none text-blue-gray-900 opacity-70">
                  Product Price
                </p>
              </th>
              <th className="p-4 border-b border-blue-gray-100 bg-blue-gray-50">
                <p className="block font-sans text-sm antialiased font-normal leading-none text-blue-gray-900 opacity-70">
                  Product Category
                </p>
              </th>
              <th className="p-4 border-b border-blue-gray-100 bg-blue-gray-50">
                <p className="block font-sans text-sm antialiased font-normal leading-none text-blue-gray-900 opacity-70" />
              </th>
            </tr>
          </thead>
          {orderList.map((order) => {
            return (
              <tbody key={orderList._id}>
                <tr className="even:bg-blue-gray-50/50 ">
                  <td className="p-4 border gray-200">
                    <div class="h-[30px] w-[30px] rounded-full">
                      <img class="h-full w-full rounded-full" alt="" />
                    </div>
                  </td>
                  <td className="p-4 border gray-200">
                    <p className="block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900">
                      {order.items.map((item) => (
                        <div>
                            {item.pname}
                        </div>
                      ))}
                    </p>
                  </td>
                  <td className="p-4 border gray-200">
                    <p className="block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900">
                      {order.paymentDetails.amount/100}
                    </p>
                  </td>
                  <td className="p-4 border gray-200">
                    <p className="block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900">
                      {order.paymentDetails.status}
                    </p>
                  </td>

                 
                  <td className="p-4 border gray-200">
                    <p className="block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900">
                      {order.paymentDetails.receipt_email}
                    </p>
                  </td>
                  <td className="p-4 border gray-200">
                    <p className="block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900">
                      {order.items.pname}
                    </p>
                  </td>
                  <td className="p-4 border gray-200">
                    <button
                      type="button"
                      className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900 border gray-200"
                      onClick={() => {
                        deleteOrder(order._id);
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              </tbody>
            );
          })}
        </table>
      </div>
    </>
  );
};

export default ManageProduct;
