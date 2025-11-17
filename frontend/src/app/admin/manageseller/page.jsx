"use client";
import React, { useEffect, useState } from "react";

const ManageSeller = () => {
  const [sellerList, setSellerList] = useState([]);
  const fetchSellerData = () => {
    fetch("http://localhost:5000/seller/getall")
      .then((response) => {
        console.log(response.status);
        return response.json();
      })
      .then((data) => {
        console.log(data);
        setSellerList(data);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  useEffect(() => {
    fetchSellerData();
  }, []);

  const deleteSeller = (id) => {
    fetch("http://localhost:5000/user/delete/" + id, { method: "DELETE" })
      .then((response) => {
        if (response.status === 200) {
          toast.success("Successfully deleted!");
          fetchProductData();
        } else {
          toast.error("Some error occured");
        }
      })
      .catch((err) => {
        console.log(err);
        toast.error("Some error occured");
      });
  };

  return <>
    <div className="relative flex flex-col w-full h-full overflow-scroll text-gray-700 bg-white shadow-md bg-clip-border rounded-xl">
      <table className="w-full text-left table-auto min-w-max">
        <thead>
          <tr>
            <th className="p-4 border-b border-blue-gray-100 bg-blue-gray-50">
              <p className="block font-sans text-sm antialiased font-normal leading-none text-blue-gray-900 opacity-70">
                First Name
              </p>
            </th>
            <th className="p-4 border-b border-blue-gray-100 bg-blue-gray-50">
              <p className="block font-sans text-sm antialiased font-normal leading-none text-blue-gray-900 opacity-70">
                Last Name
              </p>
            </th>
            <th className="p-4 border-b border-blue-gray-100 bg-blue-gray-50">
              <p className="block font-sans text-sm antialiased font-normal leading-none text-blue-gray-900 opacity-70">
                Email
              </p>
            </th>
            <th className="p-4 border-b border-blue-gray-100 bg-blue-gray-50">
              <p className="block font-sans text-sm antialiased font-normal leading-none text-blue-gray-900 opacity-70">
                Password
              </p>
            </th>
          </tr>
        </thead>
        {
             sellerList.map((seller)=>{
                return <tbody key={sellerList._id}>
                <tr className="even:bg-blue-gray-50/50">
                  <td className="p-4">
                    <p className="block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900">
                    {seller.fname}
                    </p>
                  </td>
                  <td className="p-4">
                    <p className="block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900">
                    {seller.lname}
                    </p>
                  </td>
                  <td className="p-4">
                    <p className="block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900">
                    {seller.email}
                    </p>
                  </td>
                  <td className="p-4">
                    <p className="block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900">
                    {seller.password}
                    </p>
                  </td>
                  <td className="p-4">
                    <button
                      type="button"
                      className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
                      onClick={()=>{deleteSeller(seller._id)}}
                    >
                      Delete
                    </button>
                    <button
                      type="button"
                      className="focus:outline-none text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900"
                    >
                      Update
                    </button>
                  </td>
                </tr>
              </tbody>
            })
        }
      </table>
    </div>
  </>;
};

export default ManageSeller;
