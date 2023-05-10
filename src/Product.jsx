import { useState, useEffect } from "react";
import { API } from "../global.js";
import "./product.css";
import Button from "@mui/material/Button";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { NavBar } from "./NavBar";

export const ProductList = () => {
  const [show, setShow] = useState(true);
  const [product, setProduct] = useState([]);
  const [cartid, setCartid] = useState("");
  const [cart, setCart] = useState("");
  const handleCart = async (id) => {
    await fetch(`${API}/addtocart/${id}/645b7dfa0f3e50ca3bd39a4f`, {
      method: "PUT",
      headers: { "content-type": "application/json" },
    });
  };
  const getData = () => {
    fetch(`${API}/products`)
      .then((response) => response.json())
      .then((data) => setProduct(data))
      .catch((error) => console.log(error));
  };
  useEffect(() => {
    getData();
  }, []);
  useEffect(() => {
    fetch(`${API}/cart/645b7dfa0f3e50ca3bd39a4f`)
      .then((response) => response.json())
      .then((cart) => {
        const cartArray = cart.cart;
        const cartLength = cartArray.length;
        setCart(cartLength);
      });
  }, [show]);
  return (
    <div>
      <NavBar cart={cart} />
      <div className="product-list">
        {product.map((data) => (
          <ProductCard
            key={data._id}
            data={data}
            setShow={setShow}
            show={show}
            handleCart={handleCart}
          />
        ))}
      </div>
    </div>
  );
};

const ProductCard = ({ data, handleCart, setShow, show }) => {
  return (
    <div className="product-card">
      <img src={data.image} />
      <h3>{data.name}</h3>
      <p>{data.description}</p>
      <h4>{`Rs.${data.price} /-`}</h4>
      <Button
        onClick={() => {
          handleCart(data._id);
          setShow(!show);
        }}
        variant="contained"
        startIcon={<ShoppingCartIcon />}
      >
        Add to cart
      </Button>
    </div>
  );
};
