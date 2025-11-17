"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { IoSearch } from "react-icons/io5";

import toast from "react-hot-toast";

const Showpiece = () => {
  const [productList, setProductList] = useState([]);

  const [product, setProduct] = useState([]);

  const { category } = useParams();

  const fetchShowpieceproduct = async () => {
    const res = await fetch("http://localhost:5000/product/getbycategory/TECH");

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
        <div className="col-md-3 mt-4 ">
          <div className=" bg-transparent " style={{ border: "none" }}>
            <img
              src={"http://localhost:5000/" + product.image}
              alt=""
              className="card-img-top img-fluid"
              style={{ objectFit: "cover", height: 250 }}
            />

            <div
              className="card-footer"
              style={{ border: "none", height: "200px" }}
            >
              <h2
                className=" fw-semibold fs-5 mt-3 mb-3"
                style={{ fontFamily: "serif" }}
              >
                {product.pname}
              </h2>
              <p className="text-red-700" style={{ fontFamily: "cursive" }}>
                {product.pprice}
              </p>

              <p className="text-black  mb-3" style={{ fontFamily: "cursive" }}>
                {product.pcategory}
              </p>
              <button
                disabled={isInCart(product)}
                onClick={(e) => addItemToCart(product)}
                className="mt-2 mb-2 bg-green-600 hover:bg-green-700 py-1 px-3 text-white mx-auto  block rounded"
              >
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
        return cat.pname.toLowerCase().includes(value.toLowerCase());
      })
    );
  };

  return (
    <div className="pt-16">
      <form className="input-group mb-4 w-75 mx-auto">
        <input
          type="search"
          role="search"
          className="form-control bg-dark bg-opacity-25"
          style={{ fontFamily: "cursive" }}
          placeholder="Search"
          onChange={filterProducts}
        />
        <button
          className="btn btn-danger fs-5 fw-semibold"
          style={{ fontFamily: "serif" }}
        >
          <IoSearch />
        </button>
      </form>

      <div className="container-fluid ">
        <div className="container">
          <div className="row  ">{displayproductData()}</div>
        </div>
      </div>
    </div>
  );
};

export default Showpiece;
