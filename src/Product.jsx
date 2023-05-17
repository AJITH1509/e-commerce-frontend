import { useState, useEffect } from "react";
import { API } from "../global.js";
import "./product.css";
import Button from "@mui/material/Button";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { NavBar } from "./NavBar";
import { LinearColor } from "./Loading.jsx";
import { Pagination } from "./Pagination.jsx";

export const ProductList = () => {
  const [show, setShow] = useState(true);
  const [product, setProduct] = useState([]);
  const [cart, setCart] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const LastPostIndex = currentPage * 8;
  const firstPostIndex = LastPostIndex - 8;
  const [loading, setLoading] = useState(true);
  const [matchFound, setMatchFound] = useState(true);

  const pagination = product.slice(firstPostIndex, LastPostIndex);
  const handleCart = async (id) => {
    await fetch(`${API}/addtocart/${id}/645b7dfa0f3e50ca3bd39a4f`, {
      method: "PUT",
      headers: { "content-type": "application/json" },
    }).then(() => setShow(!show));
  };
  const getData = () => {
    fetch(`${API}/products`)
      .then((response) => response.json())
      .then((data) => {
        setProduct(data);
        setLoading(false);
      })
      .catch((error) => console.log(error));
  };
  useEffect(() => {
    getData();
  }, []);

  const handleSearch = (e) => {
    let key = e.target.value;
    if (key) {
      // Add a check to ensure searchQuery is not empty
      fetch(`${API}/products/search/${key}`)
        .then((response) => response.json())
        .then((data) => {
          setProduct(data);
          setMatchFound(data.length > 0);
        });
    } else {
      getData(); // Clear the product list if searchQuery is empty
    }
  };

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
      <NavBar cart={cart} handleSearch={handleSearch} />

      {loading ? (
        <LinearColor />
      ) : (
        <div>
          <div className="product-list">
            {matchFound ? (
              pagination.map((data) => (
                <ProductCard
                  key={data._id}
                  data={data}
                  setShow={setShow}
                  show={show}
                  handleCart={handleCart}
                />
              ))
            ) : (
              <h1>No match found</h1>
            )}
          </div>
          <Pagination
            total={product.length}
            setCurrentPage={setCurrentPage}
            currentPage={currentPage}
          />
        </div>
      )}
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
        }}
        variant="contained"
        startIcon={<ShoppingCartIcon />}
      >
        Add to cart
      </Button>
    </div>
  );
};
