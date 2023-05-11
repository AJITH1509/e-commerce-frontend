import { useNavigate } from "react-router-dom";
import "./cart.css";
import { useState } from "react";
import { API } from "../global";
import { useEffect } from "react";
import { NavBar } from "./NavBar";
import Button from "@mui/material/Button";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
export const Cart = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const user = "645b7dfa0f3e50ca3bd39a4f"; //localStorage.getItem("id");
  const getCartItems = () => {
    fetch(`${API}/cart/${user}`)
      .then((res) => res.json())
      .then((data) => setCartItems(data.cart));
  };
  useEffect(() => {
    getCartItems();
  }, []);

  const deleteCartItems = (id) => {
    fetch(`${API}/delete/${id}/${user}`, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then(() => getCartItems());
  };

  return (
    <div>
      <NavBar cart={cartItems.length} />
      {cartItems.length === 0 ? (
        <div className="empty-cart">
          <img
            src="https://www.chandranscreation.com/images/empty-cart.jpg"
            alt="no-items-image"
          />
        </div>
      ) : (
        <div className="product-list-cart">
          {cartItems.map((data) => (
            <CartItemCard
              key={data._id}
              data={data}
              deleteCartItems={deleteCartItems}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const CartItemCard = ({ data, deleteCartItems }) => {
  return (
    <div className="product-card-cart">
      <img src={data.image} />
      <h3>{data.name}</h3>
      <p>{data.description}</p>
      <h4>{`Rs.${data.price} /-`}</h4>
      <Button
        onClick={() => {
          deleteCartItems(data._id);
        }}
        variant="contained"
        startIcon={<ShoppingCartIcon />}
      >
        remove
      </Button>
    </div>
  );
};
