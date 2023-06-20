import { useState, useEffect } from "react";
import { API } from "../global.js";
import "./product.css";
import Button from "@mui/material/Button";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { NavBar } from "./NavBar";
import { Pagination } from "./Pagination.jsx";
import Snackbar from "@mui/material/Snackbar";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import { Footer } from "./Footer.jsx";

const ProductCardLoading = () => {
  return (
    <div className="product-card">
      <Box sx={{ pt: 0.5 }}>
        <Skeleton variant="rectangular" width={150} height={118} />
        <Skeleton />
        <Skeleton width="60%" />
        <Skeleton />
        <Skeleton variant="rectangular" width="70%" height={20} />
      </Box>
    </div>
  );
};

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
  const numbers = [1, 2, 3, 4, 5, 6, 7, 8];
  const [state, setState] = useState({
    open: false,
    vertical: "top",
    horizontal: "right",
  });
  const { vertical, horizontal, open } = state;

  //for open snack Bar
  const handleOpenSnackbar = (message) => {
    setMessage(message);
    setState({ ...state, open: true });
    //timer for snack bar
    setTimeout(handleClose, 5000);
  };

  //for close snack Bar
  const handleClose = () => {
    setState({ ...state, open: false });
  };

  //products slice for pagination
  const pagination = product.slice(firstPostIndex, LastPostIndex);

  //add products to cart
  const handleCart = async (id) => {
    const result = await fetch(`${API}/addtocart/${id}/${user}`, {
      method: "PUT",
      headers: { "content-type": "application/json" },
    });
    const response = await result.json();
    //opens snack bar
    handleOpenSnackbar(response.message);
    setShow(!show);
  };
  //get all products
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

  //search for products
  const handleSearch = (keyword) => {
    let key = keyword;
    if (key !== "") {
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

  //for showing cart number for each user
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
      <div>
        <NavBar cart={cart} handleSearch={handleSearch} />

        {loading ? (
          <div className="product-list">
            {numbers.map((_, index) => (
              <ProductCardLoading key={index} />
            ))}
          </div>
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
      <Footer />
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
