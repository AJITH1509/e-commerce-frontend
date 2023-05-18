import { useState, useEffect } from "react";
import { API } from "../global.js";
import "./product.css";
import Button from "@mui/material/Button";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { NavBar } from "./NavBar";
import { LinearColor } from "./Loading.jsx";
import { Pagination } from "./Pagination.jsx";
import Snackbar from "@mui/material/Snackbar";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

export const ProductList = () => {
  const [show, setShow] = useState(true);
  const [product, setProduct] = useState([]);
  const [cart, setCart] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const LastPostIndex = currentPage * 8;
  const firstPostIndex = LastPostIndex - 8;
  const [loading, setLoading] = useState(true);
  const [matchFound, setMatchFound] = useState(true);
  const [message, setMessage] = useState("");
  const user = localStorage.getItem("id");
  const [state, setState] = useState({
    open: false,
    vertical: "top",
    horizontal: "right",
  });
  const { vertical, horizontal, open } = state;
  const handleOpenSnackbar = (message) => {
    setMessage(message);
    setState({ ...state, open: true });
  };

  const handleClose = () => {
    setState({ ...state, open: false });
  };

  const pagination = product.slice(firstPostIndex, LastPostIndex);
  const handleCart = async (id) => {
    const result = await fetch(`${API}/addtocart/${id}/${user}`, {
      method: "PUT",
      headers: { "content-type": "application/json" },
    });
    const response = await result.json();
    handleOpenSnackbar(response.message);
    setShow(!show);
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
    fetch(`${API}/cart/${user}`)
      .then((response) => response.json())
      .then((cart) => {
        const cartArray = cart.cart;
        const cartLength = cartArray.length;
        setCart(cartLength);
      });
  }, [show]);

  const refreshWindow = () => {
    window.location.reload();
  };

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
              // <h1>No match found</h1>
              <img
                style={{ cursor: "pointer" }}
                onClick={refreshWindow}
                src="https://cdn.dribbble.com/users/898770/screenshots/3744292/search-bar.gif"
              />
            )}
          </div>
          <Pagination
            total={product.length}
            setCurrentPage={setCurrentPage}
            currentPage={currentPage}
          />
        </div>
      )}

      <Snackbar
        anchorOrigin={{ vertical, horizontal }}
        open={open}
        onClose={handleClose}
        message={message}
        key={vertical + horizontal}
        action={
          <IconButton size="small" color="inherit" onClick={handleClose}>
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      />
    </div>
  );
};

const ProductCard = ({ data, handleCart }) => {
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
