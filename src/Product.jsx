/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { API } from "../global.js";
import "./product.css";

export const ProductList = () => {
  const [product, setProduct] = useState([]);
  console.log(product);
  const getData = () => {
    fetch(`${API}/products`)
      .then((response) => response.json())
      .then((data) => setProduct(data))
      .catch((error) => console.log(error));
  };
  useEffect(() => {
    getData();
  }, []);
  return (
    <div className="product-list">
      {product.map((data) => (
        <ProductCard key={data._id} data={data} />
      ))}
    </div>
  );
};

const ProductCard = ({ data }) => {
  return (
    <div className="product-card">
      <img src={data.image} />
      <h3>{data.name}</h3>
      <p>{data.description}</p>
      <h4>{`Rs.${data.price}/-`}</h4>
    </div>
  );
};
